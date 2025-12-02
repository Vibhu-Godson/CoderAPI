using System.Security.Claims;

namespace CoderAPI.Helper.Interface
{
    public interface ISubscriptionHelper
    {
        bool isPremiumUser(ClaimsPrincipal user);
        bool isFreeUser(ClaimsPrincipal user);
    }
}
