using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemService _problemService;
        private readonly ICustomLogger _logger;

        public ProblemController(IProblemService problemService, ICustomLogger logger)
        {
            _problemService = problemService;
            _logger = logger;
        }

        [HttpPost()]
        public async Task<ActionResult<ListPageDto<ProblemCard>>> GetProblems([FromQuery] ProblemQuery query, int pageNumber, int pageSize)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _problemService.GetProblems(query, pageNumber, pageSize, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "unable to get all problems", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{ProblemId}")]
        public async Task<ActionResult<ProblemDto>> GetProblemById(long ProblemId)
        {
            try
            {
                var response = await _problemService.GetProblemById(ProblemId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "Unable to get the problem", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UserSolution")]
        public async Task<ActionResult<StatusResponse>> RunCode(RunCodeRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
