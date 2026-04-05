using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.DTOs;

namespace JobMatcher.IdentityCore.Services
{
    public interface IJwtService
    {
        AuthResponse GenerateJwt(ApplicationUser user, IEnumerable<string> roles);
    }
}
