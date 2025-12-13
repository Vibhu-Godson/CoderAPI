using CoderAPI.DBOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

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
                await this.SetAllSessionsInActive(ProblemId, userId);
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
        private async Task<bool> SetAllSessionsInActive(long ProblemId, long userId)
        {
            var sessions = await _context.UserProblemSessions
                .Where(ups => ups.UserId == userId && ups.ProblemId == ProblemId)
                .ToListAsync();

            sessions.ForEach(s => s.IsActive = false);
            var ok = await _context.SaveChangesAsync();
            return ok > 0;
        }

        public async Task<long> GetActiveUserProblemSession(long ProblemId, long userId)
        {
            try
            {
                var ActiveSessionId = await _context.UserProblemSessions
                    .Where(ups => ups.IsActive && ups.ProblemId == ProblemId && ups.UserId == userId)
                    .Select(ups => ups.UserProblemSessionId)
                    .FirstOrDefaultAsync();

                return ActiveSessionId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get active user Problem Session for ProblemId: {ProblemId},\n userId: {userId}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<bool> MarkUserSessionComplete(long userSessionId, long userId)
        {
            try
            {
                var userSession = await _context.UserProblemSessions.FindAsync(userSessionId);
                userSession.SessionStatus = SessionStatus.Completed.ToString();
                userSession.UpdatedOn = DateTime.UtcNow;
                userSession.UpdatedBy = userId;
                var ok = await _context.SaveChangesAsync();
                return (ok > 0 ? true : false);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to mark userSession Complete with userSessionId: {userSessionId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
