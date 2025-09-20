using CoderAPI.DBOs;

namespace CoderAPI.Repository.Interface
{
    public interface IUserSolutionRepository
    {
        Task<long> AddUserSolution(UserSolution solution);
        Task<string> MarkUserSolutionCompleted(long userSolutionId);
    }
}
