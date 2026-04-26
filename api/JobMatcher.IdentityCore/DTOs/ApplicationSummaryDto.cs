using System;

namespace JobMatcher.IdentityCore.DTOs;

public class ApplicationSummaryDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public double MatchScore { get; set; }
    public string? Status { get; set; }
    public DateTime AppliedAt { get; set; }
}
