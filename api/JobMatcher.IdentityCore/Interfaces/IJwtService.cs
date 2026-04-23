using JobMatcher.IdentityCore.Entities;
using JobMatcher.IdentityCore.DTOs;

namespace JobMatcher.IdentityCore.Interfaces
{
    public interface IJwtService
    {
        AuthResponse GenerateJwt(AppUser user, IEnumerable<string> roles);
    }
}
