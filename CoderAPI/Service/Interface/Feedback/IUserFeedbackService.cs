using CoderAPI.DTOs;
using CoderAPI.DTOs.Feedback;

namespace CoderAPI.Service.Interface.Feedback
{
    public interface IUserFeedbackService
    {
        Task<ListDto<UserFeedbackBar>> GetUserFeedbacks(long userId);
        Task<UserFeedbackDto> GetUserFeedbackById(long userFeedbackId, long userId);
        Task<StatusResponse> AddUserFeedback(UserFeedbackDto userFeedback, long userId);
        Task<ListDto<UserReviews>> GetUserReviews();
    }
}
