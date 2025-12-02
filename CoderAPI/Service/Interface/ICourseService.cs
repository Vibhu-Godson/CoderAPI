using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;

namespace CoderAPI.Service.Interface
{
    public interface ICourseService
    {
        Task<ListDto<CourseCard>> GetPopularCourses();
        Task<ListDto<BundleCard>> GetPopularBundles();
        Task<ListDto<CategoryDto>> GetCategories();
        Task<ListDto<CourseCard>> GetCoursesByCategory(int categoryId);
        Task<LockCourseDto> GetCourseById(long courseId);
        Task<BundleDto> GetBundleById(long bundleId);
        Task<ListDto<CourseCard>> SearchCourses(string keyword);
    }
}
