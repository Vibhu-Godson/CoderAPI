using CoderAPI.DBOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class UserPlanRepository : IUserPlanRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserPlanRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(string, DateTime?)> GetUserPlanLevelAndExpiry(long userId)
        {
            try
            {
                var userPLan = await _context.UserPlans
                    .AsNoTracking()
                    .Where(up => up.UserId == userId && up.IsActive == true)
                    .FirstOrDefaultAsync();

                return 
                    userPLan != null 
                    ? (userPLan.SubscriptionLevel ?? SubscriptionLevel.Free.ToString(), userPLan.EndDate) 
                    : (SubscriptionLevel.Free.ToString(), DateTime.MaxValue);
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "DbError: Unable to get user plan level and expiry", ex);
                throw;
            }
        }
    }
}
