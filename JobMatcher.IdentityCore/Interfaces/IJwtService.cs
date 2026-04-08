using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.DTOs;

namespace JobMatcher.IdentityCore.Interfaces
{
    public interface IJwtService
    {
        AuthResponse GenerateJwt(ApplicationUser user, IEnumerable<string> roles);
    }
}
