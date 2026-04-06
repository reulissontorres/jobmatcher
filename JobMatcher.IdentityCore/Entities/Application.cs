namespace JobMatcher.IdentityCore.Entities
{
    public class Application
    {
        public Guid Id { get; set; }

        public Guid JobId { get; set; }
        public Job? Job { get; set; }

        public Guid CandidateId { get; set; }

        public double MatchScore { get; set; }

        public string? Status { get; set; }

        public DateTime AppliedAt { get; set; }
    }
}
