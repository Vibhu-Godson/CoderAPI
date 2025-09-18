using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface
{
    public interface IAuthService
    {
        Task<LoginResponse> Login(LoginRequest request);
        Task<StatusResponse> RegisterUser(UserDto request);
    }
}
