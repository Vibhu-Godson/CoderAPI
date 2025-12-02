using CoderAPI.DBOs;
using CoderAPI.DTOs.plan;

namespace CoderAPI.Repository.Interface
{
    public interface IUserPlanRepository
    {
        Task<(string, DateTime?)> GetUserPlanLevelAndExpiry(long userId);
        Task<List<PlanCard>> GetAllPlan();
        Task<Plann> GetPlanById(long PlanId);
        Task<long> GetActiveUserPlanId(long userId);
        Task<long> AddUserPlan(UserPlan plan);
        Task<long> UpdateUserPlan(long UserPlanId, string status, string RazorPayPaymentDetail);
    }
}
