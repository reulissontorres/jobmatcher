namespace JobMatcher.IdentityCore.Entities.Builders;

public class CandidateBuilder
{
    private readonly Guid _id;
    private readonly DateTime _createdAt;
    private string _fullName = string.Empty;
    private string? _email;
    private string? _phone;
    private string? _resumeText;

    private readonly List<SkillEntry> _skills = new();
    private readonly List<WorkExperience> _workExperiences = new();
    private readonly List<Education> _educations = new();

    public CandidateBuilder()
    {
        _id = Guid.NewGuid();
        _createdAt = DateTime.UtcNow;
    }

    public CandidateBuilder WithBasicInfo(string fullName, string? email, string? phone)
    {
        _fullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        _email = email;
        _phone = phone;
        return this;
    }

    public CandidateBuilder WithResume(string? resumeText)
    {
        _resumeText = resumeText;
        return this;
    }

    public CandidateBuilder AddSkill(string name, int level)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Skill name is required.", nameof(name));
        if (level < 1 || level > 100) throw new ArgumentOutOfRangeException(nameof(level), "Skill level must be between 1 and 100.");
        _skills.Add(new SkillEntry(name.Trim(), level));
        return this;
    }

    public CandidateBuilder AddWorkExperience(string companyName, string role, string? description, DateTime startDate, DateTime? endDate)
    {
        var we = new WorkExperience
        {
            Id = Guid.NewGuid(),
            CandidateId = _id,
            CompanyName = companyName,
            Role = role,
            Description = description,
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            EndDate = endDate.HasValue ? DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : (DateTime?)null
        };
        _workExperiences.Add(we);
        return this;
    }

    public CandidateBuilder AddEducation(string institution, string degree, string? fieldOfStudy, DateTime startDate, DateTime? endDate)
    {
        var edu = new Education
        {
            Id = Guid.NewGuid(),
            CandidateId = _id,
            Institution = institution,
            Degree = degree,
            FieldOfStudy = fieldOfStudy,
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            EndDate = endDate.HasValue ? DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : (DateTime?)null
        };
        _educations.Add(edu);
        return this;
    }

    public IReadOnlyList<SkillEntry> SkillEntries => _skills.AsReadOnly();

    public Candidate Build()
    {
        if (string.IsNullOrWhiteSpace(_fullName)) throw new InvalidOperationException("FullName is required.");

        var candidate = new Candidate
        {
            Id = _id,
            FullName = _fullName.Trim(),
            Email = _email,
            Phone = _phone,
            ResumeText = _resumeText,
            CreatedAt = _createdAt,
            CandidateSkills = new List<CandidateSkill>(),
            WorkExperiences = _workExperiences,
            Educations = _educations,
            Applications = new List<Application>()
        };

        return candidate;
    }

    // Static helpers for update scenarios
    public static WorkExperience CreateWorkExperience(Guid candidateId, string companyName, string role, string? description, DateTime startDate, DateTime? endDate)
    {
        return new WorkExperience
        {
            Id = Guid.NewGuid(),
            CandidateId = candidateId,
            CompanyName = companyName,
            Role = role,
            Description = description,
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            EndDate = endDate.HasValue ? DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : (DateTime?)null
        };
    }

    public static Education CreateEducation(Guid candidateId, string institution, string degree, string? fieldOfStudy, DateTime startDate, DateTime? endDate)
    {
        return new Education
        {
            Id = Guid.NewGuid(),
            CandidateId = candidateId,
            Institution = institution,
            Degree = degree,
            FieldOfStudy = fieldOfStudy,
            StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
            EndDate = endDate.HasValue ? DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc) : (DateTime?)null
        };
    }

    public record SkillEntry(string Name, int Level);
}
