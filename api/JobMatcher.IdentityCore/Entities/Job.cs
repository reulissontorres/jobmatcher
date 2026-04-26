using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.Entities;

public enum JobStatus
{
    Draft = 0,
    Open = 1,
    Closed = 2
}

public class Job
{
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = default!;

    [Required]
    public string Description { get; set; } = default!;

    public string? Requirements { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? EmploymentType { get; set; }

    public JobStatus Status { get; set; } = JobStatus.Draft;

    public DateTime CreatedAt { get; set; }

    public Guid CompanyId { get; set; }

    public Company? Company { get; set; }

    public List<Application>? Applications { get; set; }
}
