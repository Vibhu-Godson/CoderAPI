using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.Problem;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Problem
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemDetailController : ControllerBase
    {
        private readonly IProblemDetailService _problemDetailService;
        private readonly ICustomLogger _logger;

        public ProblemDetailController(IProblemDetailService problemDetailService, ICustomLogger logger)
        {
            _problemDetailService = problemDetailService;
            _logger = logger;
        }

        [HttpGet("Languages")]
        public async Task<ActionResult<ListDto<Language>>> GetLanguagesByProblemId(long ProblemId)
        {
            try
            {
                var response = await _problemDetailService.GetLanguagesByProblemId(ProblemId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get languages for ProblemId: {ProblemId}", ex);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message + ex.StackTrace);
            }
        }

        [HttpGet("StarterCode")]
        public async Task<ActionResult<CustomString>> GetCommonCodeByProblemDetail(long ProblemDetailId)
        {
            try
            {
                var response = await _problemDetailService.GetCommonCodeByProblemDetail(ProblemDetailId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to get common code for ProblemDetailId: {ProblemDetailId}", ex);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message + ex.StackTrace);
            }
        }
    }
}
