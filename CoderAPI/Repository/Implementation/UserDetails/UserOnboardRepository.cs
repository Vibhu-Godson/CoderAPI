using CoderAPI.DBOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.User;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.UserDetails
{
    public class UserOnboardRepository : IUserOnboardRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserOnboardRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> IsUserOnboarded(long userId)
        {
            try
            {
                var found = await _context.UserDetails
                    .AnyAsync(ud => ud.UserId == userId);
                return found;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to check if user onboarding is done for userId:{userId}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }
    }
}
