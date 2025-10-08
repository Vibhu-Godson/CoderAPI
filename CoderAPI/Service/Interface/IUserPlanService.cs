using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;

namespace CoderAPI.Service.Interface
{
    public interface IUserPlanService
    {
        Task<ListDto<PlanCard>> GetAllPlan(long userId);
    }
}
