using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.UserDetails;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UserOnboardController : ControllerBase
    {
        private readonly IUserOnboardService _userOnboardService;
        private readonly ICustomLogger _logger;

        public UserOnboardController(IUserOnboardService userOnboardService, ICustomLogger logger)
        {
            _userOnboardService = userOnboardService;
            _logger = logger;
        }

        [HttpGet("done")]
        public async Task<ActionResult<StatusResponse>> CheckIfOnboarded()
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _userOnboardService.CheckIfOnboardedAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "Error in CheckIfOnboarded: " + ex.Message + ex.StackTrace, ex);
                return StatusCode(500, new StatusResponse { Status = false, Message = "Internal server error" });
            }
        }
    }
}
