using JobMatcher.IdentityCore.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Interfaces
{
    public interface IApplicationService
    {
        Task<ServiceResult<ApplicationSummaryDto>> ApplyCandidateToJobAsync(Guid candidateId, Guid jobId);
        Task<ServiceResult<List<ApplicationSummaryDto>>> GetApplicationsByJobAsync(Guid jobId);
        Task<ServiceResult<List<ApplicationSummaryDto>>> GetApplicationsByCandidateAsync(Guid candidateId);
    }
}
