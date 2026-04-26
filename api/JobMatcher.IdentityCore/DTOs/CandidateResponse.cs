using System;
using System.Collections.Generic;

namespace JobMatcher.IdentityCore.DTOs;

public class CandidateResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = default!;
    public List<string>? TopSkills { get; set; } = new();
    public string? ExperienceSummary { get; set; }
    public double? MatchScore { get; set; }
}
