using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
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
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ICustomLogger _logger;

        public CourseController(ICourseService courseService, ICustomLogger logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ListPageDto<CourseListItemDto>>> GetCourses(int pageNumber, int pageSize)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _courseService.GetAllCourse(userId, pageNumber, pageSize);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to Get Courses\n" + ex.Message, ex);
                return StatusCode(500, $"Internal server error, {ex.Message}");
            }
        }

        [HttpGet("details")]
        public async Task<ActionResult<CourseDetailDto>> GetCourse(long courseId, Guid userId)
        {
            try
            {
                var response = await _courseService.GetCourseDetails(courseId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to Get Course Details\n" + ex.Message, ex);
                return StatusCode(500, $"Internal server error, {ex.Message}");
            }
        }
    }
}
