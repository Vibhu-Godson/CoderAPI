using CoderAPI.DTOs.Feedback;

namespace CoderAPI.Repository.Interface.Feedback
{
    public interface IUserFeedbackRepository
    {
        Task<List<UserFeedbackBar>> GetAllUserFeedback(long userId);
        Task<UserFeedbackDto> GetUserFeedbackById(long userFeedbackId, long userId);
        Task<long> AddUserFeedback(UserFeedbackDto userFeedback, long userId);
        Task<List<UserReviews>> GetUserReviews();
    }
}
