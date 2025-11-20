using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface.UserDetails
{
    public interface IUserOnboardService
    {
        Task<StatusResponse> CheckIfOnboardedAsync(long userId);
    }
}
