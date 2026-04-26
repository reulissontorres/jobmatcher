namespace JobMatcher.IdentityCore.Entities;

public class Company
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
