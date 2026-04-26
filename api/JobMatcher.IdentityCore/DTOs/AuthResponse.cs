namespace JobMatcher.IdentityCore.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = default!;
    public DateTime Expiration { get; set; }
    public UserDto User { get; set; } = default!;
}
