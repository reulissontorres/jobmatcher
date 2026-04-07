using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs
{
    public class CandidateSkillDto
    {
        [Required]
        public string Name { get; set; } = default!;

        [Range(1, 100)]
        public int Level { get; set; }
    }
}
