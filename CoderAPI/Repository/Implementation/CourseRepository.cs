using CoderAPI.DBOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class CourseRepository : ICourseRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public CourseRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<CourseListItemDto>> GetAllCourse(long userId, int pageNumber, int pageSize)
        {
            try
            {
                var courses = await _context.Courses
                    .Skip((pageNumber-1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new CourseListItemDto
                    {
                        CourseId = c.CourseId,
                        Title = c.Title,
                        Description = c.Description,
                        Level = c.Level,
                        Price = c.Price,
                        DurationInHours = (int)c.DurationInHours,
                        IsEnrolled = _context.UserCourses.Any(uc => uc.UserId == userId && uc.CourseId == c.CourseId),
                        //ImageUrl = c.ImageUrl
                    })
                    .ToListAsync();

                return courses;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "DbError: unable to Get All Course\n" + ex.Message, ex);
                throw;
            }
        }

        public Task<List<CourseListItemDto>> GetAllCourseByKeyword(string keyword,long userId, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public async Task<CourseDetailDto> GetCourseDetails(long courseId)
        {
            try
            {
                var details = await _context.Courses.Where(c => c.CourseId == courseId)
                    .Select(c => new CourseDetailDto
                    {
                        CourseId = c.CourseId,
                        Title = c.Title,
                        Description = c.Description,
                        Level = c.Level,
                        Price = c.Price,
                        DurationInHours = (int)c.DurationInHours,
                        Topics = _context.CourseTopics.Where(t => t.CourseId == c.CourseId)
                                    .Select(t => new TopicDto
                                    {
                                        TopicId = t.TopicId,
                                        TopicName = t.Topic.TopicName,
                                        TopicDescription = t.Topic.TopicDescription,
                                    }).ToList()
                        //ImageUrl = c.ImageUrl
                    }).FirstOrDefaultAsync();
                
                return details;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to Get Course Details By Id: {courseId}\n" + ex.Message, ex);
                throw;
            }
        }
    }
}
