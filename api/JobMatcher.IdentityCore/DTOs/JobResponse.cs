namespace JobMatcher.IdentityCore.DTOs;

public class JobResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = default!;
    public int CandidatesCount { get; set; }
    public double AverageMatchScore { get; set; }
}
