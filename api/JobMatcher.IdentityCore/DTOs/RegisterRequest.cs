using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs
{
    public class RegisterRequest
    {
        [Required, MaxLength(256)]
        public string FullName { get; set; } = default!;

        [Required, EmailAddress]
        public string Email { get; set; } = default!;

        [Required, MinLength(8)]
        public string Password { get; set; } = default!;

        public string? CompanyName { get; set; }
    }
}
