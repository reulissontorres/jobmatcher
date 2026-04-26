using Microsoft.Extensions.Options;
using JobMatcher.IdentityCore.Interfaces;
using JobMatcher.IdentityCore.Configurations;

namespace JobMatcher.IdentityCore.Services.Providers
{
    public class OpenAiEmbeddingAdapter : IEmbeddingService
    {
        private readonly HttpClient _httpClient;
        private readonly OpenAiSettings _settings;
        private readonly ILogger<OpenAiEmbeddingAdapter> _logger;

        public OpenAiEmbeddingAdapter(HttpClient httpClient, IOptions<OpenAiSettings> options, ILogger<OpenAiEmbeddingAdapter> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _settings = options?.Value ?? new OpenAiSettings();
            _logger = logger;
        }

        public async Task<float[]> GenerateEmbeddingAsync(string text)
        {
            text ??= string.Empty;

            var requestBody = new { input = text, model = _settings.Model };

            try
            {
                var response = await _httpClient.PostAsJsonAsync("v1/embeddings", requestBody);
                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    _logger?.LogError("OpenAI embeddings request failed: {Status} {Body}", response.StatusCode, body);
                    return FallbackVector();
                }

                var respObj = await response.Content.ReadFromJsonAsync<OpenAiEmbResponse>();
                var embedding = respObj?.data?.FirstOrDefault()?.embedding;
                if (embedding == null || embedding.Length == 0)
                {
                    _logger?.LogWarning("OpenAI embeddings returned empty vector");
                    return FallbackVector();
                }

                return embedding.Select(d => (float)d).ToArray();
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error calling OpenAI embeddings API");
                return FallbackVector();
            }
        }

        private float[] FallbackVector()
        {
            return new float[_settings.DefaultDimension];
        }

        private class OpenAiEmbResponse
        {
            public OpenAiData[] data { get; set; } = Array.Empty<OpenAiData>();
        }

        private class OpenAiData
        {
            public double[] embedding { get; set; } = Array.Empty<double>();
        }
    }
}
