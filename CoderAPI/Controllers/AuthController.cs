using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICustomLogger _logger;

        public AuthController(IAuthService authService, ICustomLogger logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.Login(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to login user {request.UserName}", ex);
                return StatusCode(500, new LoginResponse
                {
                    Status = false,
                    Message = "An error occurred while processing your request.",
                    Token = "",
                    UserName = ""
                });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<StatusResponse>> RegisterUser([FromBody] UserDto request)
        {
            try
            {
                var response = await _authService.RegisterUser(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to register user {request.UserName}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = "An error occurred while processing your request."
                });
            }
        }

        [HttpPost("checkUserName")]
        public async Task<ActionResult<StatusResponse>> CheckUserName(CustomString userName)
        {
            try
            {
                var response = await _authService.CheckUserName(userName);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to check user name availability", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"An error occured while checking user name's availability"
                });
            }
        }

        [HttpPost("generateOtp")]
        public async Task<ActionResult<GenerateOtp>> GenerateUserOtp(CustomString phone)
        {
            try
            {
                var response = await _authService.GenerateUserOtp(phone);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to generate OTP for {phone.Value}", ex);
                return StatusCode(500, new GenerateOtp
                {
                    Status = false,
                    Message = "An error occurred while processing your request.",
                    Otp = ""
                });
            }
        }

        [HttpPost("validateOtp")]
        public async Task<ActionResult<StatusResponse>> ValidateUserOtp([FromBody] ValidateOtp request)
        {
            try
            {
                var response = await _authService.ValidateUserOtp(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to validate OTP for {request.Phone}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = "An error occurred while processing your request."
                });
            }
        }
    }
}
