using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;

namespace CoderAPI.Service.Interface
{
    public interface ICourseService
    {
        Task<ListPageDto<CourseListItemDto>> GetAllCourse(long userId, int pageNumber, int pageSize);
        Task<CourseDetailDto> GetCourseDetails(long courseId);
        Task<ListPageDto<CourseListItemDto>> GetAllCourseByKeyword(string keyword, long userId, int pageNumber, int pageSize);
    }
}
