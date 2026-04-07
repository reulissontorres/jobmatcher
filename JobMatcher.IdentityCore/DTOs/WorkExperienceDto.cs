using System;
using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs
{
    public class WorkExperienceDto
    {
        [Required]
        public string CompanyName { get; set; } = default!;

        [Required]
        public string Role { get; set; } = default!;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
