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
        public async Task<ActionResult<ListPageDto<ProblemCard>>> GetProblems(ProblemQuery query, int pageNumber, int pageSize)
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
            try
            {
                var response = await _problemService.RunCode(request, Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "Unable to run the code", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("NewSession")]
        public async Task<ActionResult<CreateUserSessionResponse>> StartNewSession(long ProblemId)
        {
            try
            {
                var response = await _problemService.StartNewUserProblemSession(ProblemId, Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "Unable to start new session", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Promt")]
        public Task<ActionResult<LLMResponse>> UserSessionChat(LLMAnalysisRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
