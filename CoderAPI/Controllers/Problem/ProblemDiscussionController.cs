using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemDiscussion;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.Problem;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers.Problem
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemDiscussionController : ControllerBase
    {
        private readonly IProblemDiscussionService _problemDiscussionService;
        private readonly ICustomLogger _logger;

        public ProblemDiscussionController(IProblemDiscussionService problemDiscussionService, ICustomLogger logger)
        {
            _problemDiscussionService = problemDiscussionService;
            _logger = logger;
        }

        [HttpPost("Add")]
        public async Task<ActionResult<StatusResponse>> AddDiscussion(AddProblemDiscussionModel problemDiscussion)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _problemDiscussionService.AddDiscussion(problemDiscussion, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,$"Unable to add discussion\n\n{ex.Message}, \n\n{ex.StackTrace}",ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to add discussion\n\n{ex.Message}\n\n{ex.StackTrace}"
                });
            }
        }

        [HttpPut("Update")]
        public async Task<ActionResult<StatusResponse>> UpdateDiscussion(AddProblemDiscussionModel problemDiscussion, long ProblemDiscussionId)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _problemDiscussionService.UpdateDiscussion(problemDiscussion, ProblemDiscussionId, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to update discussion\n\n{ex.Message}, \n\n{ex.StackTrace}",ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to update discussion\n\n{ex.Message}\n\n{ex.StackTrace}"
                });
            }
        }

        [HttpGet("All")]
        public async Task<ActionResult<ListPageDto<ProblemDiscussionCardView>>> GetAllDiscussions(long ProblemId, int pageNumber, int pageSize)
        {
            try
            {
                var response = await _problemDiscussionService.GetAllDiscussions(ProblemId, pageNumber, pageSize);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to fetch discussions\n\n{ex.Message}, \n\n{ex.StackTrace}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to fetch discussions\n\n{ex.Message}\n\n{ex.StackTrace}"
                });
            }
        }

        [HttpGet("Open")]
        public async Task<ActionResult<ProblemDiscussionDto>> GetProblemDiscussion(long ProblemDiscussionId)
        {
            try
            {
                var response = await _problemDiscussionService.GetProblemDiscussion(ProblemDiscussionId);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to fetch discussion\n\n{ex.Message}, \n\n{ex.StackTrace}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to fetch discussion\n\n{ex.Message}\n\n{ex.StackTrace}"
                });
            }
        }
    }
}
