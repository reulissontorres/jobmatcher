using System;

namespace JobMatcher.IdentityCore.Entities
{
    public class EmbeddingStorage
    {
        public Guid Id { get; set; }

        // "Job" or "Candidate"
        public string EntityType { get; set; } = default!;

        public Guid EntityId { get; set; }

        // Stored as JSON string (array of floats)
        public string Vector { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
    }
}
