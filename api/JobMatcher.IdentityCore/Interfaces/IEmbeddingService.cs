using System.Threading.Tasks;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Interfaces
{
    public interface IEmbeddingService
    {
        Task<float[]> GenerateEmbeddingAsync(string text);
    }
}
