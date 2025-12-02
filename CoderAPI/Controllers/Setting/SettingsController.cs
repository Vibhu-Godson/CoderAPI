using CoderAPI.DTOs;
using CoderAPI.DTOs.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Setting
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class SettingsController : ControllerBase
    {

        [HttpGet]
        public Task<ActionResult<SettingResponseDto>> GetAllSettings()
        {

            throw new NotImplementedException();
        }

        [HttpPut("update")]
        public async Task<ActionResult<StatusResponse>> UpdateSetting([FromBody] UpdateSettingDto request)
        {
            throw new NotImplementedException();
        }

        [HttpPost("reset")]
        public async Task<ActionResult<StatusResponse>> ResetSettings(long userId)
        {
            throw new NotImplementedException();
        }
    }
}
