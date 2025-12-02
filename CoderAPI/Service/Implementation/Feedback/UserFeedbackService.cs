using CoderAPI.DTOs;
using CoderAPI.DTOs.Feedback;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Feedback;
using CoderAPI.Service.Interface.Feedback;

namespace CoderAPI.Service.Implementation.Feedback
{
    public class UserFeedbackService : IUserFeedbackService
    {
        private readonly IUserFeedbackRepository _userFeedbackRepository;
        private readonly ICustomLogger _logger;

        public UserFeedbackService(IUserFeedbackRepository userFeedbackRepository, ICustomLogger logger)
        {
            _userFeedbackRepository = userFeedbackRepository;
            _logger = logger;
        }

        public async Task<StatusResponse> AddUserFeedback(UserFeedbackDto userFeedback, long userId)
        {
            try
            {
                var response = await _userFeedbackRepository.AddUserFeedback(userFeedback, userId);
                return new StatusResponse
                {
                    Status = response > 0,
                    Message = response > 0 ? "User feedback added successfully." : "Failed to add user feedback."
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to add user feedback for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }

        public async Task<UserFeedbackDto> GetUserFeedbackById(long userFeedbackId, long userId)
        {
            try
            {
                var response = await _userFeedbackRepository.GetUserFeedbackById(userFeedbackId, userId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to get user feedback by id:{userFeedbackId} for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }

        public async Task<ListDto<UserFeedbackBar>> GetUserFeedbacks(long userId)
        {
            try
            {
                var response = await _userFeedbackRepository.GetAllUserFeedback(userId);
                return new ListDto<UserFeedbackBar>
                {
                    Items = response,
                    TotalCount = response.Count
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to get user feedbacks for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }

        public async Task<ListDto<UserReviews>> GetUserReviews()
        {
            try
            {
                var response = await _userFeedbackRepository.GetUserReviews();
                return new ListDto<UserReviews>
                {
                    Items = response,
                    TotalCount = response.Count
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServiceError: unable to get user reviews." + ex.Message, ex);
                throw;
            }
        }
    }
}
