using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;

namespace CoderAPI.Service.Interface
{
    public interface IUserCourseService
    {
        Task<ListDto<MyCourseCard>> GetMyCourses(long userId);
        Task<MyCourseDetail> GetCourseByUserCourseId(long userCourseId, long userId);
        Task<StatusResponse> UpdateUserTopicStatus(long userTopicId, string status, long userId);
        Task<StatusResponse> UpdateUserTopicAssetStatus(long usertopicAssetId, string status, long userId);
        Task<MyTopic> GetTopicByUserCourseAndTopic(long userCourseId, long TopicId, long userId);
    }
}
