namespace CoderAPI.Repository.Interface
{
    public interface IUserPlanRepository
    {
        Task<(string, DateTime?)> GetUserPlanLevelAndExpiry(long userId);
    }
}
