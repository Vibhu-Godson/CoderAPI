using CoderAPI.Helper.Interface;
using Microsoft.Extensions.Caching.Memory;
namespace CoderAPI.Helper.Implementation
{
    public class OtpHelper : IOtpHelper
    {
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _expiry = TimeSpan.FromMinutes(10);

        public OtpHelper(IMemoryCache cache)
        {
            _cache = cache;
        }

        private const string KeyPrefix = "OTP_";

        public string GenerateOtp(string phone)
        {
            var otp = new Random().Next(100000, 1000000).ToString("D6");

            _cache.Set(
                KeyPrefix + phone,
                otp,
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = _expiry
                });

            return otp;
        }

        public bool ValidateOtp(string phone, string otp)
        {
            var key = KeyPrefix + phone;

            if (_cache.TryGetValue(key, out string? storedOtp))
            {
                if (storedOtp == otp)
                {
                    _cache.Remove(key); // one-time use
                    return true;
                }
            }

            return false;
        }
    }
}
