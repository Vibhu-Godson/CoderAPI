using CoderAPI.DBOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;

namespace CoderAPI.Repository.Implementation
{
    public class UserProblemSessionRepository : IUserProblemSessionRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserProblemSessionRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> CreateUserProblemSession(long ProblemId, long userId)
        {
            try
            {
                var userProblemSession = new UserProblemSession
                {
                    ProblemId = ProblemId,
                    UserId = userId,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    SessionStatus = SessionStatus.Active.ToString(),
                    StartedOn = DateTime.UtcNow,
                    EndedOn = null,
                    IsActive = true,
                };
                await _context.UserProblemSessions.AddAsync(userProblemSession);
                await _context.SaveChangesAsync();
                return userProblemSession.UserProblemSessionId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "DbError: Unable to create user problem session", ex);
                throw;
            }
        }
    }
}
