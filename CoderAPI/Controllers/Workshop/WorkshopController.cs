using CoderAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Workshop
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class WorkshopController : ControllerBase
    {
        [HttpPost("add")]
        public Task<ActionResult<StatusResponse>> AddWorkshop()
        {
            throw new NotImplementedException();
        }

        [HttpPost("goals")]
        public Task<ActionResult<StatusResponse>> AddGoals(long WorkshopId) 
        { 
            throw new NotImplementedException(); 
        }

        [HttpPost("events")]
        public Task<ActionResult<StatusResponse>> AddEvents(long WorkshopId)
        {
            throw new NotImplementedException();
        }
    }
}
