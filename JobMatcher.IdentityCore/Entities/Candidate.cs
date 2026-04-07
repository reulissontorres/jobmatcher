using System;
using System.Collections.Generic;

namespace JobMatcher.IdentityCore.Entities
{
    public class Candidate
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = default!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? ResumeText { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<CandidateSkill> CandidateSkills { get; set; } = new();
        public List<WorkExperience> WorkExperiences { get; set; } = new();
        public List<Education> Educations { get; set; } = new();
        public List<Application> Applications { get; set; } = new();
    }
}
