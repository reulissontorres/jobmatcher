using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Interfaces;

public interface ICandidateService
{
    Task<ServiceResult<CandidateResponse>> CreateCandidateAsync(CreateCandidateRequest request);
    Task<ServiceResult<List<CandidateResponse>>> GetAllCandidatesAsync(string? search = null, string? skill = null, Guid? jobId = null, int page = 1, int pageSize = 20);
    Task<ServiceResult<CandidateDetailsResponse>> GetCandidateByIdAsync(Guid id);
    Task<ServiceResult<CandidateResponse>> UpdateCandidateAsync(Guid id, UpdateCandidateRequest request);
    Task<ServiceResult<bool>> DeleteCandidateAsync(Guid id);
}
