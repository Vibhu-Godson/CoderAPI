using CoderAPI.DBOs;
using CoderAPI.DTOs.Course;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class UserCourseRepository : IUserCourseRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserCourseRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddUserCourse(UserCourse userCourse)
        {
            try
            {
                await _context.UserCourses.AddAsync(userCourse);
                await _context.SaveChangesAsync();
                return userCourse.UserCourseId;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add User Course", ex);
                throw;
            }
        }

        public async Task<bool> AddUserCourseRange(List<UserCourse> userCourseList)
        {
            try
            {
                await _context.UserCourses.AddRangeAsync(userCourseList);
                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to Add user course range", ex);
                throw;
            }
        }

        public async Task<MyCourseDetail> GetCourseByUserCourseId(long userCourseId, long userId)
        {
            try
            {
                var userCourse = await _context.UserCourses
                    .Where(uc => uc.UserCourseId == userCourseId && uc.UserId == userId)
                    .Select(uc => new MyCourseDetail
                    {
                        CourseId = uc.CourseId,
                        CourseName = uc.Course.Title,
                        OverAllProgress = 10,
                        UserCourseId = uc.UserCourseId,
                        Topics = _context.CourseTopics
                            .Where(ct => ct.CourseId == uc.CourseId)
                            .Select(ct => new TopicLockDto
                            {
                                TopicId = ct.TopicId,
                                TopicName = ct.Topic.TopicName,
                                SortOrder = ct.Topic.SortOrder ?? 0,
                                TopicDescription = ct.Topic.TopicDescription
                            })
                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                return userCourse;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get course by userCourseId: {userCourseId}", ex);
                throw;
            }
        }

        public async Task<List<MyCourseCard>> GetMyCourses(long userId)
        {
            try
            {
                var response = await (from uc in _context.UserCourses
                                      where uc.UserId == userId

                                      join c in _context.Courses on uc.CourseId equals c.CourseId into cGrp
                                      from c in cGrp.DefaultIfEmpty()

                                      select new
                                      {
                                          uc.CourseId,
                                          c.Title,
                                          uc.UserCourseId,
                                          CompletedCount = _context.UserTopics
                                           .Count(ut => ut.UserCourseId == uc.UserCourseId &&
                                                        ut.Status == TopicProgressStatus.Completed.ToString()),
                                          TotalCount = _context.UserTopics
                                           .Count(ut => ut.UserCourseId == uc.UserCourseId)
                                      }
                )
                .Select(r => new MyCourseCard
                {
                    CourseId = r.CourseId,
                    CourseName = r.Title,
                    UserCourseId = r.UserCourseId,
                    OverAllProgress = r.TotalCount == 0 ? 0m : (decimal)r.CompletedCount / (decimal)r.TotalCount,
                })
                .ToListAsync();

                return response;

            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get my courses by userId: {userId}", ex);
                throw;
            }
        }

        public async Task<MyTopic> GetTopicByUserCourseAndTopic(long userCourseId, long TopicId, long userId)
        {
            try
            {
                var response = await _context.UserTopics
                    .Where(ut => ut.UserCourseId == userCourseId && ut.TopicId == TopicId)
                    .Select(ut => new MyTopic
                    {
                        TopicId = ut.TopicId,
                        UserCourseId = ut.UserCourseId,
                        LastAccessedOn = ut.LastAccessedOn ?? DateTime.UtcNow,
                        ProgressPercent = ut.ProgressPercent ?? 0,
                        Status = ut.Status,
                        UserTopicId = ut.UserTopicId,
                        TopicAssets = _context.UserTopicAssets.Where(uta => uta.UserTopicId == ut.UserTopicId)
                                            .Select(uta => new MyTopicAssets
                                            {
                                                UserTopicId = uta.UserTopicId,
                                                ProgressPercent = uta.ProgressPercent ?? 0,
                                                Status = uta.Status,
                                                TopicAssetId = uta.TopicAssetId,
                                                UserTopicAssetId = uta.UserTopicAssetId,
                                            })
                                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get topic by usercourseId :{userCourseId} and TopicId: {TopicId}", ex);
                throw;
            }
        }

        public async Task<long> UpdateUserCourse(long userCourseId, string RazorpayPaymentId, string Status, long userId)
        {
            try
            {
                var userCourse = await _context.UserCourses.FindAsync(userCourseId);
                userCourse.RazorpayPaymentId = RazorpayPaymentId;
                userCourse.PurchaseDate = DateTime.UtcNow;
                userCourse.IsActive = true;
                userCourse.PaymentStatus = Status;
                userCourse.UpdatedOn = DateTime.UtcNow;
                userCourse.UpdatedBy = userId;
                var ok = await _context.SaveChangesAsync();
                if(ok>0) return userCourse.UserCourseId;
                return 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update user course with userCourseId: {userCourseId}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateUserCoursebyRazorpayOrderId(string RazorpayOrderId, string RazorpayPaymentId, string Status, long userId)
        {
            try
            {
                var userCourses = await _context.UserCourses
                    .Where(uc => uc.RazorpayOrderId == RazorpayOrderId)
                    .ToListAsync();

                foreach(var uc in userCourses)
                {
                    uc.RazorpayPaymentId = RazorpayPaymentId;
                    uc.PurchaseDate = DateTime.UtcNow;
                    uc.IsActive = true;
                    uc.PaymentStatus = Status;
                    uc.UpdatedOn = DateTime.UtcNow;
                    uc.UpdatedBy = userId;
                }
                var ok = await _context.SaveChangesAsync();
                if (ok > 0) return true;
                return false;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update user courses by RazorPayOrderId for userId:{userId}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateUserTopicAssetStatus(long usertopicAssetId, string status, long userId)
        {
            try
            {
                var uta = await _context.UserTopicAssets
                    .FindAsync(usertopicAssetId);

                uta.Status = status;
                uta.UpdatedOn = DateTime.UtcNow;
                uta.UpdatedBy = userId;
                
                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update User Topic Asset Status", ex);
                throw;
            }
        }

        public async Task<bool> UpdateUserTopicStatus(long userTopicId, string status, long userId)
        {
            try
            {
                var userTopic = await _context.UserTopics.FindAsync(userTopicId);
                userTopic.Status = status;
                userTopic.UpdatedOn = DateTime.UtcNow;
                userTopic.UpdatedBy = userId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update user topic Staus", ex);
                throw;
            }
        }
    }
}
