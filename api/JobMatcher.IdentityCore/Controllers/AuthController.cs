using Microsoft.AspNetCore.Mvc;
using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _auth.RegisterAsync(model);
        if (!result.Succeeded) return BadRequest(new { errors = result.Errors });

        return Ok(result.Data);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _auth.LoginAsync(model);
        if (!result.Succeeded) return Unauthorized(new { errors = result.Errors });

        return Ok(result.Data);
    }
}
