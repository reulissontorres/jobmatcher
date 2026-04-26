namespace JobMatcher.IdentityCore.Entities;

public enum ApplicationStatus
{
    Pending = 0,
    Reviewed = 1,
    Rejected = 2,
    Accepted = 3
}

public class Application
{
    public Guid Id { get; set; }

    public Guid JobId { get; set; }
    public Job? Job { get; set; }

    public Guid CandidateId { get; set; }
    public Candidate? Candidate { get; set; }

    public double MatchScore { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    public DateTime AppliedAt { get; set; }
}
