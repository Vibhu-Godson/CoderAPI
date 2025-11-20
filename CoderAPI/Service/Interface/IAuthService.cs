using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface
{
    public interface IAuthService
    {
        Task<LoginResponse> Login(LoginRequest request);
        Task<StatusResponse> RegisterUser(UserDto request);
        Task<StatusResponse> CheckUserName(CustomString userName);
        Task<GenerateOtp> GenerateUserOtp(CustomString phone);
        Task<StatusResponse> ValidateUserOtp(ValidateOtp request);
    }
}
