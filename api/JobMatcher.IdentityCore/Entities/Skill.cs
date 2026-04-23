namespace JobMatcher.IdentityCore.Entities
{
    public class Skill
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public List<CandidateSkill> CandidateSkills { get; set; } = new();
    }
}
