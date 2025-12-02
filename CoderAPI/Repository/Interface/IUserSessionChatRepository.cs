using CoderAPI.DBOs;
using CoderAPI.DTOs.Session;

namespace CoderAPI.Repository.Interface
{
    public interface IUserSessionChatRepository
    {
        Task<List<UserSessionChatDto>> GetSessionChat(long UserProblemSessionId);
        Task<long> AddUserSessionChat(UserSessionChat userSessionChat);
        Task<bool> CanChat(long userId);
    }
}
