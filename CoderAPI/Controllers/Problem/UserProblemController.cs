using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.Problem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers.Problem
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UserProblemController : ControllerBase
    {
        private readonly IUserProblemService _userProblemService;
        private readonly ICustomLogger _logger;

        public UserProblemController(IUserProblemService userProblemService, ICustomLogger logger)
        {
            _userProblemService = userProblemService;
            _logger = logger;
        }

        [HttpGet("ListSolutions")]
        public async Task<ActionResult<ListDto<UserSolutionCardDto>>> GetUserSolutions(long ProblemId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userProblemService.GetUserSolutionCards(ProblemId, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get User Solutiuons", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpGet("ListChats")]
        public async Task<ActionResult<ListDto<UserChatCardDto>>> GetUserChats(long ProblemId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userProblemService.GetUserChats(ProblemId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get User Chats", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpGet("Solution")]
        public async Task<ActionResult<UserSolutionDto>> GetUserSolution(long UserSolutionId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userProblemService.GetUserSolution(UserSolutionId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get User Solutiuons", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpGet("Chat")]
        public async Task<ActionResult<UserChatDto>> GetUserChat(long userSessionId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userProblemService.GetUserChat(userSessionId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get User chat", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }
    }
}
