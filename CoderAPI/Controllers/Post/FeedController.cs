using CoderAPI.DTOs;
using CoderAPI.DTOs.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Post
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class FeedController : ControllerBase
    {
        [HttpGet("gloabal")]
        public Task<ActionResult<ListPageDto<PostShow>>> GetFeed()
        {
            throw new NotImplementedException();
        }

        [HttpGet("tribe")]
        public Task<ActionResult<ListPageDto<PostShow>>> GetTribeFeed(long TribeId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("workshop")]
        public Task<ActionResult<ListPageDto<PostShow>>> GetWorkshopFeed(long WorkshopId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("myTribes")]
        public Task<ActionResult<ListDto<PostShow>>> GetMyTribeFeed()
        {
            throw new NotImplementedException();
        }
    }
}
