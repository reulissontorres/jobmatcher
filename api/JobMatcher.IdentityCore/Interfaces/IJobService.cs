using JobMatcher.IdentityCore.DTOs;
using JobMatcher.IdentityCore.Services;

namespace JobMatcher.IdentityCore.Interfaces;

public interface IJobService
{
    Task<ServiceResult<JobResponse>> CreateJobAsync(string userId, CreateJobRequest request);
    Task<ServiceResult<List<JobResponse>>> GetAllJobsAsync(string userId, string? status = null, string? search = null, string? location = null);
    Task<ServiceResult<JobDetailsResponse>> GetJobByIdAsync(string userId, Guid id);
    Task<ServiceResult<JobResponse>> UpdateJobAsync(string userId, Guid id, UpdateJobRequest request);
    Task<ServiceResult<bool>> DeleteJobAsync(string userId, Guid id);
}
