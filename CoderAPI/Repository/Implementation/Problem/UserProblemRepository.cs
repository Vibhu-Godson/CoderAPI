using CoderAPI.DBOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Problem
{
    public class UserProblemRepository : IUserProblemRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserProblemRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<UserChatDto> GetUserSessionChat(long userSessionId, long userId)
        {
            try
            {
                var chatRows = await _context.UserSessionChats
                    .AsNoTracking()
                    .Where(uc => uc.UserProblemSessionId == userSessionId && uc.UserId == userId)
                    .Select(uc => new { uc.ChatMessage, uc.AiReply })
                    .ToListAsync();
                var response = new UserChatDto();
                response.messages = new List<UserChatMessageDto>();
                foreach(var ch in chatRows)
                {
                    var userMessage = new UserChatMessageDto
                    {
                        MessageBy = "User",
                        MessageContent = ch.ChatMessage,
                    };
                    response.messages.Add(userMessage);
                    var aiMessage = new UserChatMessageDto
                    {
                        MessageBy = "AI",
                        MessageContent = ch.AiReply,
                    };
                    response.messages.Add(aiMessage);
                }
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Session Chat by UserProblemSessionId: {userSessionId}\n {ex.Message}", ex);
                throw;
            }
        }

        public async Task<List<UserChatCardDto>> GetUserSessionChatCardsByProblemAndUser(long ProblemId, long userId)
        {
            try
            {
                var sessions = await _context.UserProblemSessions
                    .Where(us => us.ProblemId == ProblemId && us.UserId == userId)
                    .Select(us => new
                    {
                        us.UserProblemSessionId,
                        us.CreatedOn,
                        us.SessionStatus,
                        LastChatTime = _context.UserSessionChats
                            .Where(uc => uc.UserProblemSessionId == us.UserProblemSessionId)
                            .OrderByDescending(uc => uc.CreatedOn)
                            .Select(uc => (DateTime?)uc.CreatedOn)
                            .FirstOrDefault()
                    })
                    .AsNoTracking()
                    .ToListAsync();

                var result = sessions.Select(s => new UserChatCardDto
                {
                    UserProblemSessionId = s.UserProblemSessionId,
                    Date = s.CreatedOn,
                    SessionStatus = s.SessionStatus,
                    TotalDiscussionTime = (s.LastChatTime.HasValue
                        ? s.LastChatTime.Value - s.CreatedOn
                        : TimeSpan.Zero).ToString()
                }).ToList();

                return result;

            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Session Chat Cards by ProblemId: {ProblemId} and UserId: {userId}\n {ex.Message}", ex);
                throw;
            }
        }

        public async Task<UserSolutionDto> GetUserSolution(long userSolutionId, long userId)
        {
            try
            {
                var solutiuon = await _context.UserSolutions
                    .Where(us => us.UserSolutionId == userSolutionId && us.UserId == userId)
                    .Select(us => new UserSolutionDto
                    {
                        UserSolutionId = us.UserSolutionId,
                        Accuracy = us.Accuracy,
                        ProblemId = us.ProblemId,
                        Result = us.Result,
                        SelectedLanguage = us.SelectedLanguage,
                        SubmissionDate = us.SubmissionDate,
                        UserProblemSessionId = us.UserProblemSessionId,
                        UserSolutionCode = us.UserSolutionCode,
                    })
                    .FirstOrDefaultAsync();
                return solutiuon;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user solution by UserSolutionId: {userSolutionId} and userId:{userId}", ex);
                throw;
            }
        }

        public async Task<List<UserSolutionCardDto>> GetUserSolutionCardsByProblemAndUser(long ProblemId, long userId)
        {
            try
            {
                var response = await _context.UserSolutions
                    .Where(us => us.ProblemId == ProblemId && us.UserId == userId)
                    .Select(us => new UserSolutionCardDto
                    {
                        UserSolutionId = us.UserSolutionId,
                        Result = us.Result,
                        SelectedLanguage = us.SelectedLanguage,
                        SubmissionDate = us.SubmissionDate,
                        TotalExecutionTime = _context.UserTestCaseResults
                            .Where(utc => utc.UserSolutionId == us.UserSolutionId && us.UserId == userId)
                            .Sum(utc => utc.ExecutionTime) ?? 0,
                        TotalMemoryUser = _context.UserTestCaseResults
                            .Where(utc => utc.UserSolutionId == us.UserSolutionId && us.UserId == userId)
                            .Sum(utc => utc.MemoryUsed) ?? 0,
                    })
                    .ToListAsync();

                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user solution cards by ProblemId: {ProblemId} and userId:{userId}", ex);
                throw;
            }
        }

        public async Task<List<UserTestCaseResultDto>> GetUserTestCaseResult(long userSolutionId, long userId)
        {
            try
            {
                var response = await _context.UserTestCaseResults
                    .Where(utc => utc.UserSolutionId == userSolutionId)
                    .Select(utc => new UserTestCaseResultDto
                    {
                        UserTestCaseResultId = utc.UserTestCaseResultId,
                        ActualOutput = utc.Stdout,
                        ExecutionTime = utc.ExecutionTime ?? 0,
                        ExpectedOutput = utc.TestCase.ExpectedOutput,
                        Input = utc.TestCase.TestCaseDetail,
                        Status = utc.Status,
                        MemoryUsed = utc.MemoryUsed ?? 0
                    })
                    .ToListAsync();

                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user test case result by UserSolutionId: {userSolutionId} and userId:{userId}", ex);
                throw;
            }
        }
    }
}
