using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface.User
{
    public interface IResetPasswordService
    {
        Task<StatusResponse> SendPasswordResetOtp(CustomString email);
        Task<StatusResponse> ResetPassword(LoginRequest newCreds);
    }
}
