using JobMatcher.IdentityCore.DTOs;

namespace JobMatcher.IdentityCore.Services
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest model);
        Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest model);
    }
}
