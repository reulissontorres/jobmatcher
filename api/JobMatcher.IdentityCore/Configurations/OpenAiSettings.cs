using System;

namespace JobMatcher.IdentityCore.Configurations
{
    public class OpenAiSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Model { get; set; } = "text-embedding-3-small";
        // Fallback vector dimension used when provider fails — keeps behavior predictable.
        public int DefaultDimension { get; set; } = 128;
    }
}
