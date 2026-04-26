using Microsoft.AspNetCore.Identity;

namespace JobMatcher.IdentityCore.Entities;

public class AppUser : IdentityUser
{
    public string? FullName { get; set; }
    public Guid? CompanyId { get; set; }
}
