using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] ApplyRequest request)
        {
            var result = await _applicationService.ApplyCandidateToJobAsync(request.CandidateId, request.JobId);
            if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
            return Ok(result.Data);
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetByJob([FromRoute] Guid jobId)
        {
            var result = await _applicationService.GetApplicationsByJobAsync(jobId);
            if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
            return Ok(result.Data);
        }

        [HttpGet("candidate/{candidateId}")]
        public async Task<IActionResult> GetByCandidate([FromRoute] Guid candidateId)
        {
            var result = await _applicationService.GetApplicationsByCandidateAsync(candidateId);
            if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
            return Ok(result.Data);
        }
    }
}
