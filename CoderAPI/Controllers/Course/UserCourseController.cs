using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers.Course
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCourseController : ControllerBase
    {
        private readonly IUserCourseService _userCourseService;
        private readonly ICustomLogger _logger;

        public UserCourseController(IUserCourseService userCourseService, ICustomLogger logger)
        {
            _userCourseService = userCourseService;
            _logger = logger;
        }

        [HttpGet("All")]
        public async Task<ActionResult<ListDto<MyCourseCard>>> GetMyCourses()
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userCourseService.GetMyCourses(userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "Unable to get courses", ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("detail")]
        public async Task<ActionResult<MyCourseDetail>> GetCourseByUserCourseId(long userCourseId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userCourseService.GetCourseByUserCourseId(userCourseId, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to get course by userCourseId: {userCourseId}", ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("UpdateTopicStatus")]
        public async Task<ActionResult<StatusResponse>> UpdateUserTopicStatus(long userTopicId, string Status)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userCourseService.UpdateUserTopicStatus(userTopicId, Status, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to update user topic status for userTopicId: {userTopicId}", ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("UpdateTopicAssetStatus")]
        public async Task<ActionResult<StatusResponse>> UpdateUserTopicAssetStatus(long userTopicAssetId, string Status)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userCourseService.UpdateUserTopicAssetStatus(userTopicAssetId, Status, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to update user topic Asset status by userTopicAssetId: {userTopicAssetId}",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("Topic")]
        public async Task<ActionResult<MyTopic>> GetTopicByUserCourseAndTopic(long userCourseId, long TopicId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _userCourseService.GetTopicByUserCourseAndTopic(userCourseId, TopicId, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get Topic by UserCourseId: {userCourseId} and TopicId {TopicId}", ex);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
