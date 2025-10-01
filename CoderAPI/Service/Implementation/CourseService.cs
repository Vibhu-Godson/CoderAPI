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

        public async Task<ListPageDto<CourseListItemDto>> GetAllCourse(long userId, int pageNumber, int pageSize)
        {
            try
            {
                var courses = await _courseRepository.GetAllCourse(userId, pageNumber, pageSize);
                return new ListPageDto<CourseListItemDto>
                {
                    Items = courses,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"ServerError:unable to Get All Course\n" + ex.Message,ex);
                throw;
            }
        }

        public async Task<ListPageDto<CourseListItemDto>> GetAllCourseByKeyword(string keyword, long userId, int pageNumber, int pageSize)
        {
            try
            {
                var courses = await _courseRepository.GetAllCourseByKeyword(keyword, userId, pageNumber, pageSize);
                return new ListPageDto<CourseListItemDto>
                {
                    Items = courses,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError:unable to Get All Course By Keyword: {keyword}\n" + ex.Message, ex);
                throw;
            }
        }

        public async Task<CourseDetailDto> GetCourseDetails(long courseId)
        {
            try
            {
                var courseDetail = await _courseRepository.GetCourseDetails(courseId);
                return courseDetail;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError:unable to Get Course Details for CourseId: {courseId}\n" + ex.Message, ex);
                throw;
            }
        }
    }
}
