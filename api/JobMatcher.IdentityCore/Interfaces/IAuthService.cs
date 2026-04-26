using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest model);
    Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest model);
}
