namespace JobMatcher.IdentityCore.Services;

public class ServiceResult<T>
{
    public bool Succeeded { get; set; }
    public IEnumerable<string> Errors { get; set; } = Enumerable.Empty<string>();
    public T? Data { get; set; }

    public static ServiceResult<T> Success(T data) => new ServiceResult<T> { Succeeded = true, Data = data };
    public static ServiceResult<T> Failure(params string[] errors) => new ServiceResult<T> { Succeeded = false, Errors = errors };
}
