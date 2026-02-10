using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.Service.Interface.Problem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CoderAPI.Controllers.Problem
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ProblemPlayGroundController : ControllerBase
    {
        private readonly ICustomLogger _logger;
        private readonly IProblemPlayGroundService _problemPlayGround;

        public ProblemPlayGroundController(ICustomLogger logger, IProblemPlayGroundService problemPlayGround)
        {
            _logger = logger;
            _problemPlayGround = problemPlayGround;
        }

        [HttpPost("Events")]
        public Task<ActionResult<ProblemEventResponseEnvelop>> AddEvents(ListDto<ProblemEvents> evenets)
        {
            throw new NotImplementedException();
        }

        [HttpPost("RunCode")]
        public async Task<ActionResult<RunCodeApiResponse>> RunCode(RunCodeRequest runCode)
        {
            try
            {
                var userId = Convert.ToInt64(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = await _problemPlayGround.RunCode(runCode, userId);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to run code:{ex.Message}");
                return StatusCode(500,"Unable to run code");
            }
        }

        [HttpPost("Chat")]
        public Task<ActionResult<ProblemEventResponseEnvelop>> SendChat(LLMAnalysisRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
