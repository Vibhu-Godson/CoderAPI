using CoderAPI.DTOs;
using CoderAPI.DTOs.Feedback;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.Feedback;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace CoderAPI.Controllers.Feedback
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize (AuthenticationSchemes = "Bearer")]
    public class UserFeedbackController : ControllerBase
    {
        private readonly IUserFeedbackService _userFeedbackService;
        private readonly ICustomLogger _logger;

        public UserFeedbackController(IUserFeedbackService userFeedbackService, ICustomLogger logger)
        {
            _userFeedbackService = userFeedbackService;
            _logger = logger;
        }

        [HttpGet("List")]
        public async Task<ActionResult<ListDto<UserFeedbackBar>>> GetUserFeedbacks()
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userFeedbackService.GetUserFeedbacks(userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to get user feedback list." + ex.Message, ex);
                return StatusCode(500, $"Internal server error\nunable to get user feedback list.\n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpGet("")]
        public async Task<ActionResult<UserFeedbackDto>> GetUserFeedbackById(long UserFeedbackId)
        {
            try
            {
                var response = await _userFeedbackService.GetUserFeedbackById(UserFeedbackId, Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to get user feedback by id." + ex.Message, ex);
                return StatusCode(500, $"Internal server error\nunable to get user feedback by id.\n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Add")]
        public async Task<ActionResult<StatusResponse>> AddUserFeedback(UserFeedbackDto userFeedback)
        {
            try
            {
                var response = await _userFeedbackService.AddUserFeedback(userFeedback, Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to add user feedback." + ex.Message, ex);
                return StatusCode(500, $"Internal server error\nunable to add user feedback.\n{ex.Message}\n\n{ex.StackTrace}");
            }
        }
    }
}
