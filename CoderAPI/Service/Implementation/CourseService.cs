using CoderAPI.DTOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;

namespace CoderAPI.Service.Implementation
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly ICustomLogger _logger;

        public CourseService(ICourseRepository courseRepository, ICustomLogger logger)
        {
            _courseRepository = courseRepository;
            _logger = logger;
        }

        public async Task<BundleDto> GetBundleById(long bundleId)
        {
            try
            {
                var response = await _courseRepository.GetBundleById(bundleId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to retrieve bundle with ID {bundleId}", ex);
                throw;
            }
        }

        public async Task<ListDto<CategoryDto>> GetCategories()
        {
            try
            {
                var response = await _courseRepository.GetCategories();
                return new ListDto<CategoryDto> { Items = response };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServiceError: unable to retrieve categories", ex);
                throw;
            }
        }

        public async Task<LockCourseDto> GetCourseById(long courseId)
        {
            try
            {
                var response = await _courseRepository.GetCourseById(courseId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to retrieve course with ID {courseId}", ex);
                throw;
            }
        }

        public async Task<ListDto<CourseCard>> GetCoursesByCategory(int categoryId)
        {
            try
            {
                var response = await _courseRepository.GetCoursesByCategory(categoryId);
                return new ListDto<CourseCard> { Items = response };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to retrieve courses for category with ID {categoryId}", ex);
                throw;
            }
        }

        public async Task<ListDto<BundleCard>> GetPopularBundles()
        {
            try
            {
                var response = await _courseRepository.GetPopularBundles();
                return new ListDto<BundleCard> { Items = response };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServiceError: unable to retrieve popular bundles", ex);
                throw;
            }
        }

        public async Task<ListDto<CourseCard>> GetPopularCourses()
        {
            try
            {
                var response = await _courseRepository.GetPopularCourses();
                return new ListDto<CourseCard> { Items = response };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServiceError: unable to retrieve popular courses", ex);
                throw;
            }
        }

        public async Task<ListDto<CourseCard>> SearchCourses(string keyword)
        {
            try
            {
                var response = await _courseRepository.SearchCourses(keyword);
                return new ListDto<CourseCard> { Items = response};
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: unable to search courses with keyword {keyword}", ex);
                throw;
            }
        }
    }
}
