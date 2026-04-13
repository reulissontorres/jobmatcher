using System;

namespace JobMatcher.IdentityCore.Entities
{
    public class Education
    {
        public Guid Id { get; set; }
        public Guid CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        public string Institution { get; set; } = default!;
        public string Degree { get; set; } = default!;
        public string? FieldOfStudy { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
