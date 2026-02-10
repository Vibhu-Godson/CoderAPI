using CoderAPI.DTOs;
using CoderAPI.DTOs.Tribe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Tribe
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class TribeController : ControllerBase
    {
        [HttpPost("add")]
        public Task<ActionResult<StatusResponse>> CreateTribe()
        {
            throw new NotImplementedException();
        }

        [HttpPost("joinRequest")]
        public Task<ActionResult<StatusResponse>> JoinTribeRequest(long TribeId)
        {
            throw new NotImplementedException();
        }

        [HttpPost("joinRequestResponse")]
        public Task<ActionResult<StatusResponse>> JoinTribeRequestUpdate(long TribeId, bool IsAccepted)
        {
            throw new NotImplementedException();
        }

        [HttpPost("goals")]
        public Task<ActionResult<StatusResponse>> AddTribeGoals(TribeGoals goals)
        {
            throw new NotImplementedException();
        }
    }
}
