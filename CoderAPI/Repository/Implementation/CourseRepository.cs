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

        public async Task<BundleDto> GetBundleById(long bundleId)
        {
            try
            {
                var response = await _context.Bundles
                    .Where(b => b.BundleId == bundleId)
                    .Select(b => new BundleDto
                    {
                        BundleId = b.BundleId,
                        Title = b.Title,
                        Description = b.Description,
                        Price = b.Price ?? 0,
                        ImageUrl = b.ImageUrl,
                        Courses = _context.CourseBundles.Where(c => c.BundleId == bundleId)
                            .Select(c => new CourseCard
                            {
                                CourseId = c.CourseId ?? 0,
                                Title = c.Course.Title,
                                ImageUrl = c.Course.ImageUrl,
                                Price = c.Course.Price
                            }).ToList()
                    })
                    .FirstOrDefaultAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,$"DbError: unable to retrieve bundle with ID {bundleId}",ex);
                throw;
            }
        }

        public async Task<List<CategoryDto>> GetCategories()
        {
            try
            {
                var response = await _context.Categories
                    .Select(c => new CategoryDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName,
                        Description = c.Description
                    })
                    .ToListAsync();

                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"DbError: unable to retrieve categories",ex);
                throw;
            }
        }

        public async Task<LockCourseDto> GetCourseById(long courseId)
        {
            try
            {
                var response = await _context.Courses
                    .Where(c => c.CourseId == courseId)
                    .Select(c => new LockCourseDto
                    {
                        CourseId = c.CourseId,
                        Title = c.Title,
                        Description = c.Description,
                        Price = c.Price,
                        DurationHours = c.DurationInHours ?? 0,
                        Level = c.Level,
                        Topics = _context.CourseTopics
                            .Where(ct => ct.CourseId == courseId)
                            .Select(x => new TopicLockDto
                            {
                                TopicId = x.TopicId,
                                SortOrder = x.Topic.SortOrder ?? 0,
                                TopicName = x.Topic.TopicName,
                                TopicDescription = x.Topic.TopicDescription
                            })
                            .ToList()
                    })
                    .FirstOrDefaultAsync();
                
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,$"DbError: unable to retrieve course with ID {courseId}",ex);
                throw;
            }
        }

        public async Task<List<CourseCard>> GetCoursesByCategory(int categoryId)
        {
            try
            {
                var response = await _context.CourseCategories
                    .Where(cc => cc.CategoryId == categoryId)
                    .Select(cc => new CourseCard
                    {
                        CourseId = cc.CourseId,
                        Title = cc.Course.Title,
                        ImageUrl = cc.Course.ImageUrl,
                        Price = cc.Course.Price
                    })
                    .ToListAsync();

                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,$"DbError: unable to retrieve courses for category ID {categoryId}",ex);
                throw;
            }
        }

        public async Task<List<BundleCard>> GetPopularBundles()
        {
            try
            {
                var response = await _context.Bundles
                    .Where(b => b.IsActive == true)
                    .Select(b => new BundleCard
                    {
                        BundleId = b.BundleId,
                        Title = b.Title,
                        Price = b.Price ?? 0,
                        ImageUrl = b.ImageUrl
                    })
                    .ToListAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"DbError: unable to retrieve popular bundles",ex);
                throw;
            }
        }

        public async Task<List<CourseCard>> GetPopularCourses()
        {
            try
            {
                var response = await _context.Courses
                    .Select(c => new CourseCard
                    {
                        CourseId = c.CourseId,
                        Title = c.Title,
                        ImageUrl = c.ImageUrl,
                        Price = c.Price
                    })
                    .ToListAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error,"DbError: unable to retrieve popular courses",ex);
                throw;
            }
        }

        public Task<List<CourseCard>> SearchCourses(string keyword)
        {
            try
            {
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to search courses with keyword {keyword}", ex);
                throw;
            }
        }
    }
}
