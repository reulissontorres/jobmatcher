namespace JobMatcher.IdentityCore.DTOs;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public double MatchScore { get; set; }
    public string? Status { get; set; }
    public DateTime AppliedAt { get; set; }
}

public class JobDetailsResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? Requirements { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? EmploymentType { get; set; }
    public string Status { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public Guid CompanyId { get; set; }
    public List<ApplicationDto>? Applications { get; set; }
}
