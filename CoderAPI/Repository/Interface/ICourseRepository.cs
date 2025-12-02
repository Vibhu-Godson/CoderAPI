using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;

namespace CoderAPI.Repository.Interface
{
    public interface ICourseRepository
    {
        Task<List<CourseCard>> GetPopularCourses();
        Task<List<BundleCard>> GetPopularBundles();
        Task<List<CategoryDto>> GetCategories();
        Task<List<CourseCard>> GetCoursesByCategory(int categoryId);
        Task<LockCourseDto> GetCourseById(long courseId);
        Task<BundleDto> GetBundleById(long bundleId);
        Task<List<CourseCard>> SearchCourses(string keyword);
    }
}
