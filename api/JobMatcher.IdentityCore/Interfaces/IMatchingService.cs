using System;
using System.Threading.Tasks;

namespace JobMatcher.IdentityCore.Interfaces
{
    public interface IMatchingService
    {
        Task<double> MatchCandidateToJobAsync(Guid candidateId, Guid jobId);
        Task MatchAllCandidatesForJobAsync(Guid jobId);
        Task MatchAllJobsForCandidateAsync(Guid candidateId);
    }
}
