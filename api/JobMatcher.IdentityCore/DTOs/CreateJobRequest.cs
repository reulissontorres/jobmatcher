using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs
{
    public class CreateJobRequest
    {
        [Required]
        public string Title { get; set; } = default!;

        [Required]
        public string Description { get; set; } = default!;

        public string? Requirements { get; set; }
        public string? Location { get; set; }
        public string? SalaryRange { get; set; }
        public string? EmploymentType { get; set; }
    }
}
