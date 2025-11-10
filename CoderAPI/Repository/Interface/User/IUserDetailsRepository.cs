namespace CoderAPI.Repository.Interface.User
{
    public interface IUserDetailsRepository
    {
        Task<bool> AddUserCurrentRole(string roleName, long userId);
        Task<bool> AddUserExperience(string experience, long UserId);
        Task<bool> AddUserEducation(string education, long UserId);
        Task<bool> AddUserProject(string project, long UserId);
        Task<bool> AddUserMotivation(string motivation, long UserId);
        Task<bool> AddUserSkills(string skills, long userId);
        Task<Dictionary<string, string>> UserOnboardingStatus(long userId);
        Task<string> GetRoleName(long userId);
        Task<string> GetUserExperience(long userId);
        Task<string> GetUserEducation(long userId);
        Task<string> GetUserProject(long userId);
        Task<string> GetUserMotivation(long userId);
        Task<string> GetUserSkills(long userId);
    }
}
