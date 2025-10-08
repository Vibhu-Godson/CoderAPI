using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;

namespace CoderAPI.Service.Implementation
{
    public class UserPlanService : IUserPlanService
    {
        private readonly IUserPlanRepository _userPlanRepository;
        private readonly ICustomLogger _logger;

        public UserPlanService(IUserPlanRepository userPlanService, ICustomLogger logger)
        {
            _userPlanRepository = userPlanService;
            _logger = logger;
        }

        public async Task<ListDto<PlanCard>> GetAllPlan(long userId)
        {
            try
            {
                var response = await _userPlanRepository.GetAllPlan();
                var activePlanId = await _userPlanRepository.GetActiveUserPlanId(userId);
                foreach(var r in response)
                {
                    if (r.PlanId == activePlanId) r.IsCurrentPlan = true;
                }
                return new ListDto<PlanCard>
                {
                    Items = response,
                    TotalCount = response.Count
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServerError: unable to get all Plans", ex);
                throw;
            }
        }
    }
}
