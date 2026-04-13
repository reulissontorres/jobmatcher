namespace JobMatcher.IdentityCore.Entities.Builders
{
    public class ApplicationBuilder
    {
        private readonly Application _app;

        public ApplicationBuilder()
        {
            _app = new Application
            {
                Id = Guid.NewGuid(),
                AppliedAt = DateTime.UtcNow,
                Status = ApplicationStatus.Pending,
                MatchScore = 0.0
            };
        }

        public ApplicationBuilder ForCandidate(Guid candidateId)
        {
            _app.CandidateId = candidateId;
            return this;
        }

        public ApplicationBuilder ForJob(Guid jobId)
        {
            _app.JobId = jobId;
            return this;
        }

        public ApplicationBuilder WithInitialStatus()
        {
            _app.Status = ApplicationStatus.Pending;
            return this;
        }

        public ApplicationBuilder WithMatchScore(double score)
        {
            _app.MatchScore = score;
            return this;
        }

        private void Validate()
        {
            if (_app.CandidateId == Guid.Empty) throw new InvalidOperationException("CandidateId is required.");
            if (_app.JobId == Guid.Empty) throw new InvalidOperationException("JobId is required.");
        }

        public Application Build()
        {
            Validate();
            return _app;
        }
    }
}
