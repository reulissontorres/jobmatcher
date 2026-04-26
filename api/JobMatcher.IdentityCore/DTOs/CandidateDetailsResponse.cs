using System;
using System.Collections.Generic;

namespace JobMatcher.IdentityCore.DTOs;

public class CandidateDetailsResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = default!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? ResumeText { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<CandidateSkillDto>? Skills { get; set; } = new();
    public List<WorkExperienceDto>? WorkExperiences { get; set; } = new();
    public List<EducationDto>? Educations { get; set; } = new();
    public List<ApplicationSummaryDto>? Applications { get; set; } = new();
}
