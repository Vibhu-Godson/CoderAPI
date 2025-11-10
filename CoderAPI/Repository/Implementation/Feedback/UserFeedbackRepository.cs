using CoderAPI.DBOs;
using CoderAPI.DTOs.Feedback;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Feedback;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Feedback
{
    public class UserFeedbackRepository : IUserFeedbackRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;
        public UserFeedbackRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddUserFeedback(UserFeedbackDto userFeedback, long userId)
        {
            try
            {
                var userFeedbackDbo = new UserFeedback
                {
                    UserId = userId,
                    FeedbackType = userFeedback.FeedbackType,
                    FeedbackText = userFeedback.FeedbackText,
                    FeedbackImageUrl = userFeedback.FeedbackImages,
                    DeviceInfo = userFeedback.DeviceInfo,
                    BrowserInfo = userFeedback.BrowserInfo,
                    AppVersion = userFeedback.AppVersion,
                    Status = "Pending",
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                    CreatedBy = userId,
                };
                await _context.UserFeedbacks.AddAsync(userFeedbackDbo);
                await  _context.SaveChangesAsync();
                return userFeedbackDbo.UserFeedbackId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user feedback for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }

        public async Task<List<UserFeedbackBar>> GetAllUserFeedback(long userId)
        {
            try
            {
                var userFeedbacks = await _context.UserFeedbacks
                    .Where(uf => uf.UserId == userId && uf.IsActive)
                    .Select(uf => new UserFeedbackBar
                    {
                        UserFeedbackId = uf.UserFeedbackId,
                        FeedbackType = uf.FeedbackType,
                        Status = uf.Status,
                        CreatedOn = uf.CreatedOn
                    })
                    .ToListAsync();
                return userFeedbacks;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user feedback list for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }

        public async Task<UserFeedbackDto> GetUserFeedbackById(long userFeedbackId, long userId)
        {
            try
            {
                var userFeedback = await _context.UserFeedbacks
                    .Where(uf => uf.UserFeedbackId == userFeedbackId && uf.UserId == userId && uf.IsActive)
                    .Select(uf => new UserFeedbackDto
                    {
                        UserFeedbackId = uf.UserFeedbackId,
                        FeedbackType = uf.FeedbackType,
                        FeedbackText = uf.FeedbackText,
                        FeedbackImages = uf.FeedbackImageUrl,
                        DeviceInfo = uf.DeviceInfo,
                        BrowserInfo = uf.BrowserInfo,
                        AppVersion = uf.AppVersion,
                        Status = uf.Status,
                        CreatedOn = uf.CreatedOn
                    })
                    .FirstOrDefaultAsync();
                return userFeedback!;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user feedback by id:{userFeedbackId} for userId:{userId}" + ex.Message, ex);
                throw;
            }
        }
    }
}
