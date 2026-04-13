using JobMatcher.IdentityCore.Data;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.Entities.Builders;
using JobMatcher.IdentityCore.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JobMatcher.IdentityCore.Services
{
    public class CandidateService : ICandidateService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<CandidateService> _logger;

        public CandidateService(ApplicationDbContext db, ILogger<CandidateService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ServiceResult<CandidateResponse>> CreateCandidateAsync(CreateCandidateRequest request)
        {
            var errors = new List<string>();
            if (string.IsNullOrWhiteSpace(request.FullName)) errors.Add("FullName is required.");

            if (request.Skills != null)
            {
                foreach (var s in request.Skills)
                {
                    if (s.Level < 1 || s.Level > 100) errors.Add($"Skill '{s.Name}' level must be between 1 and 100.");
                }
            }

            if (request.WorkExperiences != null)
            {
                foreach (var w in request.WorkExperiences)
                {
                    if (w.EndDate.HasValue && w.StartDate > w.EndDate.Value) errors.Add($"Work experience '{w.CompanyName}' has inconsistent dates.");
                }
            }

            if (request.Educations != null)
            {
                foreach (var e in request.Educations)
                {
                    if (e.EndDate.HasValue && e.StartDate > e.EndDate.Value) errors.Add($"Education '{e.Institution}' has inconsistent dates.");
                }
            }

            if (errors.Any()) return ServiceResult<CandidateResponse>.Failure(errors.ToArray());

            using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var cand = new CandidateBuilder()
                    .WithBasicInfo(request.FullName.Trim(), request.Email, request.Phone)
                    .WithResume(request.ResumeText);

                if (request.Skills != null && request.Skills.Any())
                {
                    foreach (var s in request.Skills)
                    {
                        cand.AddSkill(s.Name, s.Level);
                    }
                }

                if (request.WorkExperiences != null && request.WorkExperiences.Any())
                {
                    foreach (var w in request.WorkExperiences)
                    {
                        cand.AddWorkExperience(w.CompanyName, w.Role, w.Description, w.StartDate, w.EndDate);
                    }
                }

                if (request.Educations != null && request.Educations.Any())
                {
                    foreach (var e in request.Educations)
                    {
                        cand.AddEducation(e.Institution, e.Degree, e.FieldOfStudy, e.StartDate, e.EndDate);
                    }
                }

                var candidate = cand.Build();

                _db.Candidates.Add(candidate);

                // Skills: reuse existing or create
                if (cand.SkillEntries != null && cand.SkillEntries.Count > 0)
                {
                    var names = cand.SkillEntries.Select(s => s.Name).Where(n => !string.IsNullOrEmpty(n)).Distinct(StringComparer.OrdinalIgnoreCase).Select(n => n.Trim()).ToList();
                    var namesLower = names.Select(n => n.ToLower()).ToList();

                    var existingSkills = await _db.Skills.Where(s => namesLower.Contains(s.Name.ToLower())).ToListAsync();
                    var existingNames = existingSkills.Select(s => s.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);

                    var newSkills = names.Where(n => !existingNames.Contains(n)).Select(n => new Skill { Id = Guid.NewGuid(), Name = n }).ToList();
                    if (newSkills.Any())
                    {
                        _db.Skills.AddRange(newSkills);
                        existingSkills.AddRange(newSkills);
                    }

                    foreach (var se in cand.SkillEntries)
                    {
                        var skillEntity = existingSkills.FirstOrDefault(x => string.Equals(x.Name, se.Name.Trim(), StringComparison.OrdinalIgnoreCase));
                        if (skillEntity == null) continue;
                        var cs = new CandidateSkill { CandidateId = candidate.Id, SkillId = skillEntity.Id, Level = se.Level };
                        _db.CandidateSkills.Add(cs);
                    }
                }

                // Work experiences and educations were added to candidate by the builder and will be saved via the candidate relationship

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                var topSkills = await _db.CandidateSkills.Where(cs => cs.CandidateId == candidate.Id)
                    .OrderByDescending(cs => cs.Level)
                    .Take(3)
                    .Select(cs => cs.Skill!.Name)
                    .ToListAsync();

                var latestRole = await _db.WorkExperiences.Where(w => w.CandidateId == candidate.Id).OrderByDescending(w => w.StartDate).Select(w => w.Role).FirstOrDefaultAsync();

                var response = new CandidateResponse { Id = candidate.Id, FullName = candidate.FullName, TopSkills = topSkills, ExperienceSummary = latestRole ?? string.Empty, MatchScore = null };
                return ServiceResult<CandidateResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating candidate");
                await tx.RollbackAsync();
                return ServiceResult<CandidateResponse>.Failure("An error occurred while creating the candidate.");
            }
        }

        public async Task<ServiceResult<List<CandidateResponse>>> GetAllCandidatesAsync(string? search = null, string? skill = null, Guid? jobId = null, int page = 1, int pageSize = 20)
        {
            page = Math.Max(1, page);
            pageSize = Math.Max(1, Math.Min(200, pageSize));

            var q = _db.Candidates.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                q = q.Where(c => c.FullName.ToLower().Contains(s));
            }

            if (!string.IsNullOrWhiteSpace(skill))
            {
                var sk = skill.Trim().ToLower();
                q = q.Where(c => c.CandidateSkills.Any(cs => cs.Skill != null && cs.Skill.Name.ToLower() == sk));
            }

            var projected = q.Select(c => new
            {
                c.Id,
                c.FullName,
                TopSkills = c.CandidateSkills.OrderByDescending(cs => cs.Level).Take(3).Select(cs => cs.Skill!.Name).ToList(),
                ExperienceSummary = c.WorkExperiences.OrderByDescending(w => w.StartDate).Select(w => w.Role).FirstOrDefault(),
                MatchScore = jobId == null ? (double?)null : c.Applications.Where(a => a.JobId == jobId).Select(a => (double?)a.MatchScore).FirstOrDefault()
            });

            if (jobId.HasValue)
            {
                projected = projected.OrderByDescending(x => x.MatchScore ?? 0.0);
            }

            var list = await projected.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var result = list.Select(x => new CandidateResponse
            {
                Id = x.Id,
                FullName = x.FullName,
                TopSkills = x.TopSkills,
                ExperienceSummary = x.ExperienceSummary,
                MatchScore = x.MatchScore
            }).ToList();

            return ServiceResult<List<CandidateResponse>>.Success(result);
        }

        public async Task<ServiceResult<CandidateDetailsResponse>> GetCandidateByIdAsync(Guid id)
        {
            var candidate = await _db.Candidates.Where(c => c.Id == id).Select(c => new CandidateDetailsResponse
            {
                Id = c.Id,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.Phone,
                ResumeText = c.ResumeText,
                CreatedAt = c.CreatedAt,
                Skills = c.CandidateSkills.OrderByDescending(cs => cs.Level).Select(cs => new CandidateSkillDto { Name = cs.Skill!.Name, Level = cs.Level }).ToList(),
                WorkExperiences = c.WorkExperiences.OrderByDescending(w => w.StartDate).Select(w => new WorkExperienceDto { CompanyName = w.CompanyName, Role = w.Role, Description = w.Description, StartDate = w.StartDate, EndDate = w.EndDate }).ToList(),
                Educations = c.Educations.OrderByDescending(e => e.StartDate).Select(e => new EducationDto { Institution = e.Institution, Degree = e.Degree, FieldOfStudy = e.FieldOfStudy, StartDate = e.StartDate, EndDate = e.EndDate }).ToList(),
                Applications = c.Applications.Select(a => new ApplicationSummaryDto { Id = a.Id, JobId = a.JobId, MatchScore = a.MatchScore, Status = a.Status.ToString(), AppliedAt = a.AppliedAt }).ToList()
            }).FirstOrDefaultAsync();

            if (candidate == null) return ServiceResult<CandidateDetailsResponse>.Failure("Candidate not found.");
            return ServiceResult<CandidateDetailsResponse>.Success(candidate);
        }

        public async Task<ServiceResult<CandidateResponse>> UpdateCandidateAsync(Guid id, UpdateCandidateRequest request)
        {
            var candidate = await _db.Candidates.Include(c => c.CandidateSkills).Include(c => c.WorkExperiences).Include(c => c.Educations).FirstOrDefaultAsync(c => c.Id == id);
            if (candidate == null) return ServiceResult<CandidateResponse>.Failure("Candidate not found.");

            var errors = new List<string>();
            if (string.IsNullOrWhiteSpace(request.FullName)) errors.Add("FullName is required.");
            if (request.Skills != null)
            {
                foreach (var s in request.Skills)
                {
                    if (s.Level < 1 || s.Level > 100) errors.Add($"Skill '{s.Name}' level must be between 1 and 100.");
                }
            }
            if (request.WorkExperiences != null)
            {
                foreach (var w in request.WorkExperiences)
                {
                    if (w.EndDate.HasValue && w.StartDate > w.EndDate.Value) errors.Add($"Work experience '{w.CompanyName}' has inconsistent dates.");
                }
            }
            if (request.Educations != null)
            {
                foreach (var e in request.Educations)
                {
                    if (e.EndDate.HasValue && e.StartDate > e.EndDate.Value) errors.Add($"Education '{e.Institution}' has inconsistent dates.");
                }
            }
            if (errors.Any()) return ServiceResult<CandidateResponse>.Failure(errors.ToArray());

            using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                candidate.FullName = request.FullName.Trim();
                candidate.Email = request.Email;
                candidate.Phone = request.Phone;
                candidate.ResumeText = request.ResumeText;

                // Skills: replace
                if (candidate.CandidateSkills != null && candidate.CandidateSkills.Any())
                {
                    _db.CandidateSkills.RemoveRange(candidate.CandidateSkills);
                }

                if (request.Skills != null && request.Skills.Any())
                {
                    var names = request.Skills.Select(s => s.Name.Trim()).Where(n => !string.IsNullOrEmpty(n)).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
                    var namesLower = names.Select(n => n.ToLower()).ToList();
                    var existingSkills = await _db.Skills.Where(s => namesLower.Contains(s.Name.ToLower())).ToListAsync();
                    var existingNames = existingSkills.Select(s => s.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
                    var newSkills = names.Where(n => !existingNames.Contains(n)).Select(n => new Skill { Id = Guid.NewGuid(), Name = n }).ToList();
                    if (newSkills.Any())
                    {
                        _db.Skills.AddRange(newSkills);
                        existingSkills.AddRange(newSkills);
                    }

                    foreach (var s in request.Skills)
                    {
                        var skillEntity = existingSkills.FirstOrDefault(x => string.Equals(x.Name, s.Name.Trim(), StringComparison.OrdinalIgnoreCase));
                        if (skillEntity == null) continue;
                        _db.CandidateSkills.Add(new CandidateSkill { CandidateId = candidate.Id, SkillId = skillEntity.Id, Level = s.Level });
                    }
                }

                // Work experiences replace
                if (candidate.WorkExperiences != null && candidate.WorkExperiences.Any()) _db.WorkExperiences.RemoveRange(candidate.WorkExperiences);
                if (request.WorkExperiences != null && request.WorkExperiences.Any())
                {
                    foreach (var w in request.WorkExperiences)
                    {
                        _db.WorkExperiences.Add(CandidateBuilder.CreateWorkExperience(candidate.Id, w.CompanyName, w.Role, w.Description, w.StartDate, w.EndDate));
                    }
                }

                // Educations replace
                if (candidate.Educations != null && candidate.Educations.Any()) _db.Educations.RemoveRange(candidate.Educations);
                if (request.Educations != null && request.Educations.Any())
                {
                    foreach (var e in request.Educations)
                    {
                        _db.Educations.Add(CandidateBuilder.CreateEducation(candidate.Id, e.Institution, e.Degree, e.FieldOfStudy, e.StartDate, e.EndDate));
                    }
                }

                await _db.SaveChangesAsync();
                await tx.CommitAsync();

                var topSkills = await _db.CandidateSkills.Where(cs => cs.CandidateId == candidate.Id).OrderByDescending(cs => cs.Level).Take(3).Select(cs => cs.Skill!.Name).ToListAsync();
                var latestRole = await _db.WorkExperiences.Where(w => w.CandidateId == candidate.Id).OrderByDescending(w => w.StartDate).Select(w => w.Role).FirstOrDefaultAsync();

                var response = new CandidateResponse { Id = candidate.Id, FullName = candidate.FullName, TopSkills = topSkills, ExperienceSummary = latestRole ?? string.Empty };
                return ServiceResult<CandidateResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating candidate");
                await tx.RollbackAsync();
                return ServiceResult<CandidateResponse>.Failure("An error occurred while updating the candidate.");
            }
        }

        public async Task<ServiceResult<bool>> DeleteCandidateAsync(Guid id)
        {
            var candidate = await _db.Candidates.FirstOrDefaultAsync(c => c.Id == id);
            if (candidate == null) return ServiceResult<bool>.Failure("Candidate not found.");

            try
            {
                _db.Candidates.Remove(candidate);
                await _db.SaveChangesAsync();
                return ServiceResult<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting candidate");
                return ServiceResult<bool>.Failure("An error occurred while deleting the candidate.");
            }
        }
    }
}
