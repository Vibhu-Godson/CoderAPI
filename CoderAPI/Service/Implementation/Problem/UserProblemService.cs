using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using CoderAPI.Service.Interface.Problem;

namespace CoderAPI.Service.Implementation.Problem
{
    public class UserProblemService : IUserProblemService
    {
        private readonly IUserProblemRepository _userProblemRepository;
        private readonly ICustomLogger _logger;

        public UserProblemService(IUserProblemRepository userProblemRepository, ICustomLogger logger)
        {
            _userProblemRepository = userProblemRepository;
            _logger = logger;
        }

        public async Task<UserChatDto> GetUserChat(long userSessionId, long userId)
        {
            try
            {
                var response = await _userProblemRepository.GetUserSessionChat(userSessionId, userId);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get user chat by userSessionId: {userSessionId} and userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<ListDto<UserChatCardDto>> GetUserChats(long ProblemId, long userId)
        {
            try
            {
                var response = await _userProblemRepository.GetUserSessionChatCardsByProblemAndUser(ProblemId, userId);
                return new ListDto<UserChatCardDto> { Items = response, TotalCount = response.Count };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get user chat by ProblemId: {ProblemId} and userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<UserSolutionDto> GetUserSolution(long UserSolutionId, long userId)
        {
            try
            {
                var response = await _userProblemRepository.GetUserSolution(UserSolutionId, userId);
                response.TestCases = await _userProblemRepository.GetUserTestCaseResult(UserSolutionId, userId);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get user solution by userSolutionId: {UserSolutionId} and userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<ListDto<UserSolutionCardDto>> GetUserSolutionCards(long ProblemId, long userId)
        {
            try
            {
                var response = await _userProblemRepository.GetUserSolutionCardsByProblemAndUser(ProblemId, userId);
                return new ListDto<UserSolutionCardDto> { Items = response, TotalCount = response.Count };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get User Solution by ProblemId: {ProblemId} and userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
