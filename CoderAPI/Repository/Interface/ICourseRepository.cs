using CoderAPI.DTOs.Course;

namespace CoderAPI.Repository.Interface
{
    public interface ICourseRepository
    {
        Task<List<CourseListItemDto>> GetAllCourse(long userId, int pageNumber, int pageSize);
        Task<CourseDetailDto> GetCourseDetails(long courseId);
        Task<List<CourseListItemDto>> GetAllCourseByKeyword(string keyword, long userId, int pageNumber, int pageSize);
    }
}
