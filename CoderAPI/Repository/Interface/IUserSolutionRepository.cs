using CoderAPI.DBOs;

namespace CoderAPI.Repository.Interface
{
    public interface IUserSolutionRepository
    {
        Task<long> AddUserSolution(UserSolution solution);
        Task<(bool IsSubmit, string finalStatus)> MarkUserSolutionCompleted(long userSolutionId);
        Task<string> GetCodeByUserSolutionId(long userSolutionId);
    }
}
