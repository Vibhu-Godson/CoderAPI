using CoderAPI.DBOs;
using CoderAPI.DTOs.plan;
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

        public async Task<long> AddUserPlan(UserPlan plan)
        {
            try
            {
                var allActive = await _context.UserPlans
                        .Where(up => up.UserId == plan.UserId && up.IsActive==true)
                        .ToListAsync();
                if (allActive.Count > 0)
                {
                    foreach(var ac in allActive)
                    {
                        ac.IsActive = false;
                    }
                    await _context.SaveChangesAsync();
                }

                await _context.UserPlans.AddAsync(plan);
                var ok = await _context.SaveChangesAsync();
                if (ok > 0) return plan.UserPlanId;
                return ok;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,$"DbError: unable to add user plan for userId: {plan.UserId}",ex);
                throw;
            }
        }

        public async Task<long> GetActiveUserPlanId(long userId)
        {
            try
            {
                var userPlan = await _context.UserPlans
                    .Where(up => up.IsActive == true && up.UserId == userId)
                    .FirstOrDefaultAsync();

                if (userPlan == null)
                    return await _context.Planns
                        .Where(p => p.Name == SubscriptionLevel.Free.ToString())
                        .Select(p => p.PlanId)
                        .FirstOrDefaultAsync();
                return userPlan.PlanId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get active plan for userId: {userId}", ex);
                throw;
            }
        }

        public async Task<List<PlanCard>> GetAllPlan()
        {
            try
            {
                var plans = await _context.Planns
                    .Select(p => new PlanCard
                    {
                        Name = p.Name,
                        Description = $"Applicable for {p.DurationDays} days with described features",
                        Price = p.Price,
                        PlanId = p.PlanId,
                        IsPopular = true,
                        Features = p.PlanFeatures.Select(pf => new FeatureDto
                        {
                            feature = pf.Feature.FeatureDescription,
                            Included = true,
                        }).ToList(),
                    })
                    .ToListAsync();
                return plans;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "DbError: unable to get all plans", ex);
                throw;
            }
        }

        public async Task<Plann> GetPlanById(long PlanId)
        {
            try
            {
                var plan = await _context.Planns.FindAsync(PlanId);
                return plan;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get plan by planId: {PlanId}", ex);
                throw;
            }
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
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "DbError: Unable to get user plan level and expiry", ex);
                throw;
            }
        }

        public async Task<long> UpdateUserPlan(long UserPlanId, string status, string RazorPayPaymentDetail)
        {
            try
            {
                var plan = await _context.UserPlans.FindAsync(UserPlanId);
                plan.Status = status;
                plan.RazorpayPaymentId = RazorPayPaymentDetail;
                plan.IsActive = true;
                plan.UpdatedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return plan.UserPlanId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update user plan with userPlanId: {UserPlanId}", ex);
                throw;
            }
        }
    }
}
