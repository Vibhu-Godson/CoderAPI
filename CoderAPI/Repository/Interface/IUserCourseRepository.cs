using CoderAPI.DBOs;
using CoderAPI.DTOs.Course;

namespace CoderAPI.Repository.Interface
{
    public interface IUserCourseRepository
    {
        Task<long> AddUserCourse(UserCourse userCourse);
        Task<long> UpdateUserCourse(long userCourseId, string RazorpayPaymentId, string Status, long userId);
        Task<bool> AddUserCourseRange(List<UserCourse> userCourseList);
        Task<bool> UpdateUserCoursebyRazorpayOrderId(string RazorpayOrderId, string RazorpayPaymentId, string Status, long userId);
        Task<MyCourseDetail> GetCourseByUserCourseId(long userCourseId, long userId);
        Task<List<MyCourseCard>> GetMyCourses(long userId);
        Task<MyTopic> GetTopicByUserCourseAndTopic(long userCourseId, long TopicId, long userId);
        Task<bool> UpdateUserTopicAssetStatus(long usertopicAssetId, string status, long userId);
        Task<bool> UpdateUserTopicStatus(long userTopicId, string status, long userId);
    }
}
