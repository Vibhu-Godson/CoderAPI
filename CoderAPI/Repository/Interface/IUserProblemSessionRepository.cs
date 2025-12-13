namespace CoderAPI.Repository.Interface
{
    public interface IUserProblemSessionRepository
    {
        Task<long> CreateUserProblemSession(long ProblemId, long userId);
        Task<long> GetActiveUserProblemSession(long ProblemId, long userId);
        Task<bool> MarkUserSessionComplete(long userSessionId, long userId);
    }
}
