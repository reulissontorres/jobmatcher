using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Services;

public class MockEmbeddingService : IEmbeddingService
{
    private readonly int _dimension;

    public MockEmbeddingService(int dimension = 128)
    {
        _dimension = dimension;
    }

    public Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var vec = new float[_dimension];
        if (string.IsNullOrWhiteSpace(text)) return Task.FromResult(vec);

        var tokens = Regex.Split(text.ToLowerInvariant(), "\\W+")
                          .Where(t => !string.IsNullOrWhiteSpace(t));

        using var sha = SHA256.Create();
        foreach (var token in tokens)
        {
            var bytes = Encoding.UTF8.GetBytes(token);
            var hash = sha.ComputeHash(bytes);
            var idx = Math.Abs(BitConverter.ToInt32(hash, 0)) % _dimension;
            vec[idx] += 1f;
        }

        // L2 normalize
        double sumSq = 0;
        for (int i = 0; i < _dimension; i++) sumSq += vec[i] * vec[i];
        var norm = Math.Sqrt(sumSq);
        if (norm > 0)
        {
            for (int i = 0; i < _dimension; i++) vec[i] = (float)(vec[i] / norm);
        }

        return Task.FromResult(vec);
    }
}
