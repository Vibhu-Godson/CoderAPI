using CoderAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Post
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class PostController : ControllerBase
    {
        [HttpPost("add")]
        public Task<ActionResult<StatusResponse>> AddPost()
        {
            throw new NotImplementedException();
        }

        [HttpPost("edit")]
        public Task<ActionResult<StatusResponse>> EditPost()
        {
            throw new NotImplementedException();
        }

        [HttpPost("react")]
        public Task<ActionResult<StatusResponse>> AddReaction(long PostId, string ReactionName)
        {
            throw new NotImplementedException();
        }

        [HttpPost("comment")]
        public Task<ActionResult<StatusResponse>> AddComment(long PostId, string Comment)
        {
            throw new NotImplementedException();
        }
    }
}
