using System;
using JobMatcher.IdentityCore.Interfaces;

namespace JobMatcher.IdentityCore.Services
{
    public class SimilarityService : ISimilarityService
    {
        public double CosineSimilarity(float[] a, float[] b)
        {
            if (a == null || b == null) throw new ArgumentNullException("Vectors must not be null");
            if (a.Length != b.Length) throw new ArgumentException("Vectors must have the same length");

            double dot = 0;
            double normA = 0;
            double normB = 0;
            for (int i = 0; i < a.Length; i++)
            {
                dot += (double)a[i] * b[i];
                normA += (double)a[i] * a[i];
                normB += (double)b[i] * b[i];
            }

            if (normA == 0 || normB == 0) return 0.0;

            return dot / (Math.Sqrt(normA) * Math.Sqrt(normB));
        }
    }
}
