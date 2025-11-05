using CoderAPI.DTOs.ProblemSession;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IUserProblemRepository
    {
        Task<List<UserSolutionCardDto>> GetUserSolutionCardsByProblemAndUser(long ProblemId, long userId);
        Task<List<UserChatCardDto>> GetUserSessionChatCardsByProblemAndUser(long ProblemId, long userId);
        Task<UserSolutionDto> GetUserSolution(long userSolutionId, long userId);
        Task<UserChatDto> GetUserSessionChat(long userSessionId, long userId);
        Task<List<UserTestCaseResultDto>> GetUserTestCaseResult(long userSolutionId, long userId);
    }
}
