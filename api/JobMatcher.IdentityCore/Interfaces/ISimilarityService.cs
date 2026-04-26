
namespace JobMatcher.IdentityCore.Interfaces;

public interface ISimilarityService
{
    double CosineSimilarity(float[] a, float[] b);
}
