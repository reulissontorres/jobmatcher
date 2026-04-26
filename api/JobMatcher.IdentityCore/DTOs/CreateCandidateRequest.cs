using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs;

public class CreateCandidateRequest
{
    [Required]
    public string FullName { get; set; } = default!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? ResumeText { get; set; }

    public List<CandidateSkillDto>? Skills { get; set; } = new();

    public List<WorkExperienceDto>? WorkExperiences { get; set; } = new();

    public List<EducationDto>? Educations { get; set; } = new();
}
