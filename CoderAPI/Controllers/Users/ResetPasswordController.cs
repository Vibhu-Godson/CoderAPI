using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Service.Interface.User;
using Microsoft.AspNetCore.Mvc;

namespace CoderAPI.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResetPasswordController : ControllerBase
    {
        private readonly IResetPasswordService _resetPasswordService;
        private readonly ICustomLogger _logger;

        public ResetPasswordController(IResetPasswordService resetPasswordService, ICustomLogger logger)
        {
            _resetPasswordService = resetPasswordService;
            _logger = logger;
        }

        [HttpPost("sendOTP")]
        public async Task<ActionResult<StatusResponse>> SendPasswordResetOtp(CustomString email)
        {
            try
            {
                var response = await _resetPasswordService.SendPasswordResetOtp(email);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to send Password Reset Otp to {email.Value}\n{ex.Message}\n{ex.StackTrace}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to send Password reset OTP to {email.Value}"
                });
            }
        }

        [HttpPost("reset")]
        public async Task<ActionResult<StatusResponse>> ResetPassword(LoginRequest newPassword)
        {
            try
            {
                var response = await _resetPasswordService.ResetPassword(newPassword);
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to reset password for {newPassword.UserName}\n{ex.Message}\n{ex.StackTrace}", ex);
                return StatusCode(500, new StatusResponse
                {
                    Status = false,
                    Message = $"Unable to reset password for {newPassword.UserName}"
                });
            }
        }
    }
}
