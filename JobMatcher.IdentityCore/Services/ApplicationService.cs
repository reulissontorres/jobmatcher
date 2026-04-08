using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobMatcher.IdentityCore.Data;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMatchingService _matchingService;

        public ApplicationService(ApplicationDbContext db, IMatchingService matchingService)
        {
            _db = db;
            _matchingService = matchingService;
        }

        public async Task<ServiceResult<ApplicationSummaryDto>> ApplyCandidateToJobAsync(Guid candidateId, Guid jobId)
        {
            var candidate = await _db.Candidates.FindAsync(candidateId);
            if (candidate == null) return ServiceResult<ApplicationSummaryDto>.Failure("Candidate not found.");

            var job = await _db.Jobs.FindAsync(jobId);
            if (job == null) return ServiceResult<ApplicationSummaryDto>.Failure("Job not found.");

            var existing = await _db.Applications.FirstOrDefaultAsync(a => a.CandidateId == candidateId && a.JobId == jobId);
            if (existing != null) return ServiceResult<ApplicationSummaryDto>.Failure("Candidate already applied to this job.");

            var app = new Application
            {
                Id = Guid.NewGuid(),
                CandidateId = candidateId,
                JobId = jobId,
                MatchScore = 0.0,
                Status = ApplicationStatus.Pending,
                AppliedAt = DateTime.UtcNow
            };
            _db.Applications.Add(app);
            await _db.SaveChangesAsync();

            // compute match synchronously for now
            var score = await _matchingService.MatchCandidateToJobAsync(candidateId, jobId);

            var dto = new ApplicationSummaryDto
            {
                Id = app.Id,
                JobId = app.JobId,
                MatchScore = score,
                Status = app.Status.ToString(),
                AppliedAt = app.AppliedAt
            };

            return ServiceResult<ApplicationSummaryDto>.Success(dto);
        }

        public async Task<ServiceResult<List<ApplicationSummaryDto>>> GetApplicationsByJobAsync(Guid jobId)
        {
            var list = await _db.Applications
                .Where(a => a.JobId == jobId)
                .AsNoTracking()
                .Select(a => new ApplicationSummaryDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    MatchScore = a.MatchScore,
                    Status = a.Status.ToString(),
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();

            return ServiceResult<List<ApplicationSummaryDto>>.Success(list);
        }

        public async Task<ServiceResult<List<ApplicationSummaryDto>>> GetApplicationsByCandidateAsync(Guid candidateId)
        {
            var list = await _db.Applications
                .Where(a => a.CandidateId == candidateId)
                .AsNoTracking()
                .Select(a => new ApplicationSummaryDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    MatchScore = a.MatchScore,
                    Status = a.Status.ToString(),
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();

            return ServiceResult<List<ApplicationSummaryDto>>.Success(list);
        }
    }
}
