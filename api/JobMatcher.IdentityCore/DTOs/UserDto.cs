namespace JobMatcher.IdentityCore.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? FullName { get; set; }
    }
}
