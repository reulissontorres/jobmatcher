using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobRequest request)
    {
        var userId = GetUserId();
        var result = await _jobService.CreateJobAsync(userId, request);
        if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null, [FromQuery] string? search = null, [FromQuery] string? location = null)
    {
        var userId = GetUserId();
        var result = await _jobService.GetAllJobsAsync(userId, status, search, location);
        if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
        return Ok(result.Data);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var userId = GetUserId();
        var result = await _jobService.GetJobByIdAsync(userId, id);
        if (!result.Succeeded) return NotFound(new { error = result.Errors.FirstOrDefault() });
        return Ok(result.Data);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateJobRequest request)
    {
        var userId = GetUserId();
        var result = await _jobService.UpdateJobAsync(userId, id, request);
        if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var userId = GetUserId();
        var result = await _jobService.DeleteJobAsync(userId, id);
        if (!result.Succeeded) return BadRequest(new { error = result.Errors.FirstOrDefault() });
        return NoContent();
    }
}
