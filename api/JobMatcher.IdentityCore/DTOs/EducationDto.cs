using System;
using System.ComponentModel.DataAnnotations;

namespace JobMatcher.IdentityCore.DTOs
{
    public class EducationDto
    {
        [Required]
        public string Institution { get; set; } = default!;

        [Required]
        public string Degree { get; set; } = default!;

        public string? FieldOfStudy { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
