using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MatchingController : ControllerBase
    {
        private readonly IMatchingService _matchingService;

        public MatchingController(IMatchingService matchingService)
        {
            _matchingService = matchingService;
        }

        [HttpPost("job/{jobId}/run")]
        public async Task<IActionResult> RunForJob([FromRoute] Guid jobId)
        {
            await _matchingService.MatchAllCandidatesForJobAsync(jobId);
            return Accepted();
        }

        [HttpPost("candidate/{candidateId}/run")]
        public async Task<IActionResult> RunForCandidate([FromRoute] Guid candidateId)
        {
            await _matchingService.MatchAllJobsForCandidateAsync(candidateId);
            return Accepted();
        }
    }
}
