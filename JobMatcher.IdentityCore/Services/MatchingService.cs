using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobMatcher.IdentityCore.Data;
using JobMatcher.IdentityCore.Entities;
using Microsoft.Extensions.Logging;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Services
{
    public class MatchingService : IMatchingService
    {
        private readonly ApplicationDbContext _db;
        private readonly IEmbeddingService _embeddingService;
        private readonly ISimilarityService _similarityService;
        private readonly ILogger<MatchingService> _logger;

        public MatchingService(ApplicationDbContext db, IEmbeddingService embeddingService, ISimilarityService similarityService, ILogger<MatchingService> logger)
        {
            _db = db;
            _embeddingService = embeddingService;
            _similarityService = similarityService;
            _logger = logger;
        }

        private string BuildCandidateText(Candidate c)
        {
            var parts = new System.Collections.Generic.List<string>();
            if (!string.IsNullOrWhiteSpace(c.ResumeText)) parts.Add(c.ResumeText);
            if (c.CandidateSkills != null && c.CandidateSkills.Any()) parts.Add(string.Join(' ', c.CandidateSkills.Select(s => s.Skill?.Name)));
            if (c.WorkExperiences != null && c.WorkExperiences.Any()) parts.Add(string.Join(' ', c.WorkExperiences.Select(w => w.Role + " " + (w.Description ?? string.Empty))));
            return string.Join(" \n", parts.Where(p => !string.IsNullOrWhiteSpace(p)));
        }

        private string BuildJobText(Job j)
        {
            var parts = new System.Collections.Generic.List<string>();
            if (!string.IsNullOrWhiteSpace(j.Title)) parts.Add(j.Title);
            if (!string.IsNullOrWhiteSpace(j.Description)) parts.Add(j.Description);
            if (!string.IsNullOrWhiteSpace(j.Requirements)) parts.Add(j.Requirements);
            return string.Join(" \n", parts.Where(p => !string.IsNullOrWhiteSpace(p)));
        }

        private async Task<float[]> GetOrCreateEmbeddingAsync(string entityType, Guid entityId, string text)
        {
            var existing = await _db.EmbeddingStorages.FirstOrDefaultAsync(e => e.EntityType == entityType && e.EntityId == entityId);
            if (existing != null)
            {
                try
                {
                    var arr = JsonSerializer.Deserialize<float[]>(existing.Vector);
                    if (arr != null) return arr;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to deserialize existing embedding for {EntityType}:{EntityId}", entityType, entityId);
                }
            }

            var embedding = await _embeddingService.GenerateEmbeddingAsync(text ?? string.Empty);
            var serialized = JsonSerializer.Serialize(embedding);
            if (existing == null)
            {
                existing = new EmbeddingStorage
                {
                    Id = Guid.NewGuid(),
                    EntityType = entityType,
                    EntityId = entityId,
                    Vector = serialized,
                    CreatedAt = DateTime.UtcNow
                };
                _db.EmbeddingStorages.Add(existing);
            }
            else
            {
                existing.Vector = serialized;
                existing.CreatedAt = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();
            return embedding;
        }

        public async Task<double> MatchCandidateToJobAsync(Guid candidateId, Guid jobId)
        {
            var job = await _db.Jobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == jobId);
            var candidate = await _db.Candidates
                .Include(c => c.CandidateSkills).ThenInclude(cs => cs.Skill)
                .Include(c => c.WorkExperiences)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == candidateId);

            if (job == null || candidate == null)
            {
                _logger.LogWarning("Job or candidate not found for matching: {JobId}, {CandidateId}", jobId, candidateId);
                return 0.0;
            }

            var jobText = BuildJobText(job);
            var candidateText = BuildCandidateText(candidate);

            var jobEmbedding = await GetOrCreateEmbeddingAsync("Job", jobId, jobText);
            var candidateEmbedding = await GetOrCreateEmbeddingAsync("Candidate", candidateId, candidateText);

            var sim = _similarityService.CosineSimilarity(candidateEmbedding, jobEmbedding);
            var normalized = Math.Clamp((sim + 1.0) / 2.0 * 100.0, 0.0, 100.0);

            var application = await _db.Applications.FirstOrDefaultAsync(a => a.JobId == jobId && a.CandidateId == candidateId);
            if (application == null)
            {
                application = new Application
                {
                    Id = Guid.NewGuid(),
                    JobId = jobId,
                    CandidateId = candidateId,
                    MatchScore = normalized,
                    Status = ApplicationStatus.Pending,
                    AppliedAt = DateTime.UtcNow
                };
                _db.Applications.Add(application);
            }
            else
            {
                application.MatchScore = normalized;
            }

            await _db.SaveChangesAsync();
            return normalized;
        }

        public async Task MatchAllCandidatesForJobAsync(Guid jobId)
        {
            var job = await _db.Jobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null) return;

            var jobText = BuildJobText(job);
            var jobEmbedding = await GetOrCreateEmbeddingAsync("Job", jobId, jobText);

            // iterate candidates in batches to avoid memory spike
            var candidates = await _db.Candidates
                .Include(c => c.CandidateSkills).ThenInclude(cs => cs.Skill)
                .Include(c => c.WorkExperiences)
                .AsNoTracking()
                .ToListAsync();

            foreach (var candidate in candidates)
            {
                var candidateText = BuildCandidateText(candidate);
                var candidateEmbedding = await GetOrCreateEmbeddingAsync("Candidate", candidate.Id, candidateText);
                var sim = _similarityService.CosineSimilarity(candidateEmbedding, jobEmbedding);
                var normalized = Math.Clamp((sim + 1.0) / 2.0 * 100.0, 0.0, 100.0);

                var application = await _db.Applications.FirstOrDefaultAsync(a => a.JobId == jobId && a.CandidateId == candidate.Id);
                if (application == null)
                {
                    application = new Application
                    {
                        Id = Guid.NewGuid(),
                        JobId = jobId,
                        CandidateId = candidate.Id,
                        MatchScore = normalized,
                        Status = ApplicationStatus.Pending,
                        AppliedAt = DateTime.UtcNow
                    };
                    _db.Applications.Add(application);
                }
                else
                {
                    application.MatchScore = normalized;
                }

                await _db.SaveChangesAsync();
            }
        }

        public async Task MatchAllJobsForCandidateAsync(Guid candidateId)
        {
            var candidate = await _db.Candidates
                .Include(c => c.CandidateSkills).ThenInclude(cs => cs.Skill)
                .Include(c => c.WorkExperiences)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == candidateId);

            if (candidate == null) return;

            var candidateText = BuildCandidateText(candidate);
            var candidateEmbedding = await GetOrCreateEmbeddingAsync("Candidate", candidateId, candidateText);

            var jobs = await _db.Jobs.AsNoTracking().ToListAsync();
            foreach (var job in jobs)
            {
                var jobText = BuildJobText(job);
                var jobEmbedding = await GetOrCreateEmbeddingAsync("Job", job.Id, jobText);
                var sim = _similarityService.CosineSimilarity(candidateEmbedding, jobEmbedding);
                var normalized = Math.Clamp((sim + 1.0) / 2.0 * 100.0, 0.0, 100.0);

                var application = await _db.Applications.FirstOrDefaultAsync(a => a.JobId == job.Id && a.CandidateId == candidateId);
                if (application == null)
                {
                    application = new Application
                    {
                        Id = Guid.NewGuid(),
                        JobId = job.Id,
                        CandidateId = candidateId,
                        MatchScore = normalized,
                        Status = ApplicationStatus.Pending,
                        AppliedAt = DateTime.UtcNow
                    };
                    _db.Applications.Add(application);
                }
                else
                {
                    application.MatchScore = normalized;
                }

                await _db.SaveChangesAsync();
            }
        }
    }
}
