using CoderAPI.DBOs;
using CoderAPI.DTOs;

namespace CoderAPI.Repository.Interface
{
    public interface IUserRepository
    {
        Task<bool> CheckUsernameAvailablity(string username);
        Task<UserDto> GetUserByEmailAndPassword(string email, string password);
        Task<UserDto> GetUserByUserNameAndPassword(string username, string password);
        Task<UserDto> GetUserByPhoneAndPassword(string phone, string password);
        Task<StatusResponse> RegisterUser(UserDto request);
        Task<bool> CheckUserNameAvailable(string userName);
        Task<bool> CheckPhoneNumberAvailable(string phone);
        Task<bool> CheckEmailAvailable(string email);
    }
}
