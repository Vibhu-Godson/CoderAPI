using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Course
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ICustomLogger _logger;
        public CourseController(ICourseService courseService, ICustomLogger logger)
        {
            _courseService = courseService;
            _logger = logger;
        }

        [HttpGet("Popular")]
        public async Task<ActionResult<ListDto<CourseCard>>> GetPopularCourses()
        {
            try
            {
                var result = await _courseService.GetPopularCourses();
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve popular courses",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("PopularBundles")]
        public async Task<ActionResult<ListDto<BundleCard>>> GetPopularBundles()
        {
            try
            {
                var result = await _courseService.GetPopularBundles();
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve popular bundles",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("Categories")]
        public async Task<ActionResult<ListDto<CategoryDto>>> GetCategories()
        {
            try
            {
                var result = await _courseService.GetCategories();
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve categories",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("categories/{id}/courses")]
        public async Task<ActionResult<ListDto<CourseCard>>> GetCoursesByCategory(int id)
        {
            try
            {
                var result = await _courseService.GetCoursesByCategory(id);
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve courses by category",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LockCourseDto>> GetCourseById(int id)
        {
            try
            {
                var result = await _courseService.GetCourseById(id);
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve course by id",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("Bundles/{id}")]
        public async Task<ActionResult<BundleDto>> GetBundleById(int id)
        {
            try
            {
                var result = await _courseService.GetBundleById(id);
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to retrieve bundle by id",ex);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("Search")]
        public async Task<ActionResult<ListDto<CourseCard>>> SearchCourses([FromQuery] string keyword)
        {
            try
            {
                var result = await _courseService.SearchCourses(keyword);
                return Ok(result);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"APIError: unable to search courses",ex);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
