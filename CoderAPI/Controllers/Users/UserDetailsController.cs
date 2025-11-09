using CoderAPI.DTOs;
using CoderAPI.DTOs.User;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.UserDetails;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;

namespace CoderAPI.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDetailsController : ControllerBase
    {
        private readonly IUserDetailsService _userDetailService;
        private readonly ICustomLogger _logger;

        public UserDetailsController(IUserDetailsService userDetailService, ICustomLogger logger)
        {
            _userDetailService = userDetailService;
            _logger = logger;
        }

        [HttpPost("CurrentRole")]
        public async Task<ActionResult<StatusResponse>> AddUserCurrentRole(CustomString role)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserCurrentRole(role, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user's current role", ex);
                return StatusCode(500, $"unable to add user current role \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Experience")]
        public async Task<ActionResult<StatusResponse>> AddUserExperience(UserExperienceDto userExperience)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserExperience(userExperience, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user's experience", ex);
                return StatusCode(500, $"unable to add user experience \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Education")]
        public async Task<ActionResult<StatusResponse>> AddUserEducation(UserEducationDto userEducation)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserEducation(userEducation, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user's education", ex);
                return StatusCode(500, $"unable to add user education \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Project")]
        public async Task<ActionResult<StatusResponse>> AddUserProject(UserProjectDto userProject)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserProject(userProject, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user's project", ex);
                return StatusCode(500, $"unable to add user project \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Motivation")]
        public async Task<ActionResult<StatusResponse>> AddUserMotivation(CustomString motivation)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserMotivation(motivation, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user's motivation", ex);
                return StatusCode(500, $"unable to add user motivation \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Skills")]
        public async Task<ActionResult<StatusResponse>> AddUserSkills(CustomString skills)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.AddUserSkills(skills, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to add user skills", ex);
                return StatusCode(500, $"unable to add user skills \n{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpPost("Chat")]
        public async Task<ActionResult<UserOnboardChatResponse>> GetChatResponse(CustomString chat)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userDetailService.GetUserChatResponse(chat, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to chat with LLM\n{ex.Message}\n\n{ex.StackTrace}", ex);
                throw;
            }
        }
    }
}
