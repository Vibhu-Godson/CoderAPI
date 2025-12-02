namespace CoderAPI.Helper.Interface
{
    public interface IJwtHelper
    {
        string GenerateToken(long userId, string phone, string subscriptionLevel, DateTime? subscriptionExpiry);
    }
}
