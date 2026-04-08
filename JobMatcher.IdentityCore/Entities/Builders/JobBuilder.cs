namespace JobMatcher.IdentityCore.Entities.Builders
{
    public class JobBuilder
    {
        private readonly Job _job;

        public JobBuilder()
        {
            _job = new Job
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                Status = JobStatus.Draft
            };
        }

        public JobBuilder WithContent(string title, string? location, string? employmentType)
        {
            _job.Title = title ?? throw new ArgumentNullException(nameof(title));
            _job.Location = location;
            _job.EmploymentType = employmentType;
            return this;
        }

        public JobBuilder WithDetails(string description, string? requirements, string? salaryRange)
        {
            _job.Description = description ?? throw new ArgumentNullException(nameof(description));
            _job.Requirements = requirements;
            _job.SalaryRange = salaryRange;
            return this;
        }

        public JobBuilder ForCompany(Guid companyId)
        {
            _job.CompanyId = companyId;
            return this;
        }

        public JobBuilder AsDraft()
        {
            _job.Status = JobStatus.Draft;
            return this;
        }

        public JobBuilder AsOpen()
        {
            _job.Status = JobStatus.Open;
            return this;
        }

        public JobBuilder AsClosed()
        {
            _job.Status = JobStatus.Closed;
            return this;
        }

        private void Validate()
        {
            if (string.IsNullOrWhiteSpace(_job.Title)) throw new InvalidOperationException("Job Title is required.");
            if (string.IsNullOrWhiteSpace(_job.Description)) throw new InvalidOperationException("Job Description is required.");
            if (_job.CompanyId == Guid.Empty) throw new InvalidOperationException("CompanyId is required.");
        }

        public Job Build()
        {
            Validate();
            return _job;
        }
    }
}
