using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.Problem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Problem
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ProblemTagController:ControllerBase
    {
        private readonly IProblemTagService _problemTagService;
        private readonly ICustomLogger _logger;

        public ProblemTagController(IProblemTagService problemTagService, ICustomLogger logger)
        {
            _problemTagService = problemTagService;
            _logger = logger;
        }

        [HttpGet("AllTags")]
        public async Task<ActionResult<ListDto<TagDto>>> GetAlltags()
        {
            try
            {
                var response = await _problemTagService.GetAllTags();
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to get all tags", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }

        [HttpGet("ProblemsByTag")]
        public async Task<ActionResult<ListDto<ProblemCard>>> GetAllProblemsByTag(long TagId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
                var result = await _problemTagService.GetProblemsByTagId(TagId, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get problems by tag id {TagId}", ex);
                return StatusCode(500, $"{ex.Message}\n\n{ex.StackTrace}");
            }
        }
    }
}
