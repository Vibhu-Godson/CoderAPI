using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using System.Security.Claims;

namespace CoderAPI.Helper.Implementation
{
    public class SubscriptionHelper : ISubscriptionHelper
    {
        public bool isFreeUser(ClaimsPrincipal user)
        {
            var subscription = user.Claims.FirstOrDefault(c => c.Type == "subscription")?.Value;
            var expiry = user.Claims.FirstOrDefault(c => c.Type == "subscriptionExpiry")?.Value;

            return (subscription == SubscriptionLevel.Free.ToString() || string.IsNullOrEmpty(subscription));
        }

        public bool isPremiumUser(ClaimsPrincipal user)
        {
            var subscription = user.Claims.FirstOrDefault(c => c.Type == "subscription")?.Value;
            var expiry = user.Claims.FirstOrDefault(c => c.Type == "subscriptionExpiry")?.Value;

            if (string.IsNullOrEmpty(subscription) || subscription == SubscriptionLevel.Free.ToString() || subscription == SubscriptionLevel.Basic.ToString())
                return false;

            if (DateTime.TryParse(expiry, out var expDate))
            {
                return expDate > DateTime.UtcNow;
            }

            return false;
        }
    }
}
