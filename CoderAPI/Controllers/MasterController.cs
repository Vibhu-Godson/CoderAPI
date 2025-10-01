using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class MasterController : ControllerBase
    {
        [HttpGet("Topics")]
        public async Task<ActionResult<ListDto<TopicDto>>> GetAllTopic()
        {
            throw new NotImplementedException();
        }
    }
}
