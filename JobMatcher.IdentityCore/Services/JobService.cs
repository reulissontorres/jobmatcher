using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JobMatcher.IdentityCore.Data;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Entities;

namespace JobMatcher.IdentityCore.Services
{
    public class JobService : IJobService
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<JobService> _logger;

        public JobService(ApplicationDbContext db, UserManager<ApplicationUser> userManager, ILogger<JobService> logger)
        {
            _db = db;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<ServiceResult<JobResponse>> CreateJobAsync(string userId, CreateJobRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return ServiceResult<JobResponse>.Failure("User not found.");
            if (user.CompanyId == null) return ServiceResult<JobResponse>.Failure("User has no company assigned.");

            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                Requirements = request.Requirements,
                Location = request.Location,
                SalaryRange = request.SalaryRange,
                EmploymentType = request.EmploymentType,
                CompanyId = user.CompanyId.Value,
                CreatedAt = DateTime.UtcNow,
                Status = JobStatus.Draft
            };

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            var response = new JobResponse
            {
                Id = job.Id,
                Title = job.Title,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                CreatedAt = job.CreatedAt,
                Status = job.Status.ToString(),
                CandidatesCount = 0,
                AverageMatchScore = 0.0
            };

            return ServiceResult<JobResponse>.Success(response);
        }

        public async Task<ServiceResult<List<JobResponse>>> GetAllJobsAsync(string userId, string? status = null, string? search = null, string? location = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return ServiceResult<List<JobResponse>>.Failure("User not found.");
            if (user.CompanyId == null) return ServiceResult<List<JobResponse>>.Failure("User has no company assigned.");

            var query = _db.Jobs.AsNoTracking().Where(j => j.CompanyId == user.CompanyId.Value);

            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<JobStatus>(status, true, out var parsed))
            {
                query = query.Where(j => j.Status == parsed);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(j => EF.Functions.ILike(j.Title, $"%{search}%"));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(j => j.Location != null && j.Location == location);
            }

            var list = await query
                .Select(j => new JobResponse
                {
                    Id = j.Id,
                    Title = j.Title,
                    Location = j.Location,
                    EmploymentType = j.EmploymentType,
                    CreatedAt = j.CreatedAt,
                    Status = j.Status.ToString(),
                    CandidatesCount = j.Applications != null ? j.Applications.Count : _db.Applications.Count(a => a.JobId == j.Id),
                    AverageMatchScore = j.Applications != null && j.Applications.Count > 0 ? j.Applications.Average(a => a.MatchScore) : (_db.Applications.Where(a => a.JobId == j.Id).Any() ? _db.Applications.Where(a => a.JobId == j.Id).Average(a => a.MatchScore) : 0.0)
                })
                .ToListAsync();

            return ServiceResult<List<JobResponse>>.Success(list);
        }

        public async Task<ServiceResult<JobDetailsResponse>> GetJobByIdAsync(string userId, Guid id)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return ServiceResult<JobDetailsResponse>.Failure("User not found.");
            if (user.CompanyId == null) return ServiceResult<JobDetailsResponse>.Failure("User has no company assigned.");

            var job = await _db.Jobs.AsNoTracking()
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id && j.CompanyId == user.CompanyId.Value);

            if (job == null) return ServiceResult<JobDetailsResponse>.Failure("Job not found or access denied.");

            var details = new JobDetailsResponse
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Requirements = job.Requirements,
                Location = job.Location,
                SalaryRange = job.SalaryRange,
                EmploymentType = job.EmploymentType,
                Status = job.Status.ToString(),
                CreatedAt = job.CreatedAt,
                CompanyId = job.CompanyId,
                Applications = job.Applications?.Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    MatchScore = a.MatchScore,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                }).ToList()
            };

            return ServiceResult<JobDetailsResponse>.Success(details);
        }

        public async Task<ServiceResult<JobResponse>> UpdateJobAsync(string userId, Guid id, UpdateJobRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return ServiceResult<JobResponse>.Failure("User not found.");
            if (user.CompanyId == null) return ServiceResult<JobResponse>.Failure("User has no company assigned.");

            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.CompanyId == user.CompanyId.Value);
            if (job == null) return ServiceResult<JobResponse>.Failure("Job not found or access denied.");

            job.Title = request.Title;
            job.Description = request.Description;
            job.Requirements = request.Requirements;
            job.Location = request.Location;
            job.SalaryRange = request.SalaryRange;
            job.EmploymentType = request.EmploymentType;
            job.Status = request.Status;

            await _db.SaveChangesAsync();

            var resp = new JobResponse
            {
                Id = job.Id,
                Title = job.Title,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                CreatedAt = job.CreatedAt,
                Status = job.Status.ToString(),
                CandidatesCount = _db.Applications.Count(a => a.JobId == job.Id),
                AverageMatchScore = _db.Applications.Where(a => a.JobId == job.Id).Any() ? _db.Applications.Where(a => a.JobId == job.Id).Average(a => a.MatchScore) : 0.0
            };

            return ServiceResult<JobResponse>.Success(resp);
        }

        public async Task<ServiceResult<bool>> DeleteJobAsync(string userId, Guid id)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return ServiceResult<bool>.Failure("User not found.");
            if (user.CompanyId == null) return ServiceResult<bool>.Failure("User has no company assigned.");

            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.CompanyId == user.CompanyId.Value);
            if (job == null) return ServiceResult<bool>.Failure("Job not found or access denied.");

            // soft delete: set status to Closed
            job.Status = JobStatus.Closed;
            await _db.SaveChangesAsync();

            return ServiceResult<bool>.Success(true);
        }
    }
}
