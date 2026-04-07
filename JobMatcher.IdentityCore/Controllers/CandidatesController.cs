using System;
using System.Threading.Tasks;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobMatcher.IdentityCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatesController : ControllerBase
    {
        private readonly ICandidateService _candidateService;

        public CandidatesController(ICandidateService candidateService)
        {
            _candidateService = candidateService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCandidateRequest request)
        {
            var result = await _candidateService.CreateCandidateAsync(request);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? skill, [FromQuery] Guid? jobId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _candidateService.GetAllCandidatesAsync(search, skill, jobId, page, pageSize);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _candidateService.GetCandidateByIdAsync(id);
            if (!result.Succeeded) return NotFound(result.Errors);
            return Ok(result.Data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCandidateRequest request)
        {
            var result = await _candidateService.UpdateCandidateAsync(id, request);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return Ok(result.Data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _candidateService.DeleteCandidateAsync(id);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return NoContent();
        }
    }
}
