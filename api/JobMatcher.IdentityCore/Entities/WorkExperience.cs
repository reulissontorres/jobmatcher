using System;

namespace JobMatcher.IdentityCore.Entities
{
    public class WorkExperience
    {
        public Guid Id { get; set; }
        public Guid CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        public string CompanyName { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string? Description { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
