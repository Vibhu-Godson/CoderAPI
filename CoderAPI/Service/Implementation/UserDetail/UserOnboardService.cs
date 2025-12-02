using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.User;
using CoderAPI.Service.Interface.UserDetails;

namespace CoderAPI.Service.Implementation.UserDetail
{
    public class UserOnboardService : IUserOnboardService
    {
        private readonly IUserOnboardRepository _userOnboardRepository;
        private readonly ICustomLogger _logger;

        public UserOnboardService(IUserOnboardRepository userOnboardRepository, ICustomLogger logger)
        {
            _userOnboardRepository = userOnboardRepository;
            _logger = logger;
        }

        public async Task<StatusResponse> CheckIfOnboardedAsync(long userId)
        {
            try
            {
                var isOnboarded = await _userOnboardRepository.IsUserOnboarded(userId);
                return new StatusResponse
                {
                    Status = isOnboarded,
                    Message = isOnboarded ? "User is onboarded." : "User is not onboarded."
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to check if user is onboarded ", ex);
                throw;
            }
        }
    }
}
