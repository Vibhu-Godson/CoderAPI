using CoderAPI.DTOs;
using CoderAPI.DTOs.plan;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class PlanController : ControllerBase
    {
        private readonly IUserPlanService _userPlanService;
        private readonly ICustomLogger _logger;

        public PlanController(IUserPlanService userPlanService, ICustomLogger logger)
        {
            _userPlanService = userPlanService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ListDto<PlanCard>>> GetAllPlans()
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userPlanService.GetAllPlan(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to get all Plans", ex);
                return BadRequest(ex.Message);
            }
        }


    }
}
