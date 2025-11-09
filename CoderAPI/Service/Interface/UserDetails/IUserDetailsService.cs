using CoderAPI.DTOs;
using CoderAPI.DTOs.User;

namespace CoderAPI.Service.Interface.UserDetails
{
    public interface IUserDetailsService
    {
        Task<StatusResponse> AddUserCurrentRole(CustomString roleName, long userId);
        Task<StatusResponse> AddUserExperience(UserExperienceDto experience, long UserId);
        Task<StatusResponse> AddUserEducation(UserEducationDto education, long UserId);
        Task<StatusResponse> AddUserProject(UserProjectDto project, long UserId);
        Task<StatusResponse> AddUserMotivation(CustomString motivation, long UserId);
        Task<UserOnboardChatResponse> GetUserChatResponse(CustomString chat, long userId);
        Task<StatusResponse> AddUserSkills(CustomString skills, long userId);
    }
}
