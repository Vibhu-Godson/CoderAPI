namespace CoderAPI.Repository.Interface.User
{
    public interface IUserOnboardRepository
    {
        Task<bool> IsUserOnboarded(long userId);
    }
}
