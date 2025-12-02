using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;

namespace CoderAPI.Service.Interface.Problem
{
    public interface IUserProblemService
    {
        Task<ListDto<UserSolutionCardDto>> GetUserSolutionCards(long ProblemId, long userId);
        Task<ListDto<UserChatCardDto>> GetUserChats(long ProblemId, long userId);
        Task<UserSolutionDto> GetUserSolution(long UserSolutionId, long userId);
        Task<UserChatDto> GetUserChat(long userSessionId, long userId);
    }
}
