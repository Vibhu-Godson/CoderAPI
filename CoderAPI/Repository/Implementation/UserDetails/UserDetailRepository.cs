using CoderAPI.DBOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.User;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.User
{
    public class UserDetailRepository : IUserDetailsRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserDetailRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<bool> AddUserCurrentRole(string roleName, long userId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);
                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(userId);
                    if (userDetails == null) return false;
                }

                userDetails.CurrentRole = roleName;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = userId;
                
                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user current role", ex);
                throw;
            }
        }

        public async Task<bool> AddUserEducation(string education, long UserId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == UserId);
                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(UserId);
                    if (userDetails == null) return false;
                }

                userDetails.LatestEducation = education;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = UserId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user Education by userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<bool> AddUserExperience(string experience, long UserId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == UserId);
                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(UserId);
                    if (userDetails == null) return false;
                }

                userDetails.LatestExperience= experience;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = UserId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user experience by userId: {UserId}", ex);
                throw;
            }
        }

        public async Task<bool> AddUserMotivation(string motivation, long userId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);
                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(userId);
                    if (userDetails == null) return false;
                }

                userDetails.Motivation = motivation;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = userId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user current role", ex);
                throw;
            }
        }

        public async Task<bool> AddUserProject(string project, long userId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);
                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(userId);
                    if (userDetails == null) return false;
                }

                userDetails.LatestProject = project;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = userId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user current role", ex);
                throw;
            }
        }

        public async Task<bool> AddUserSkills(string skills, long userId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                if (userDetails == null)
                {
                    userDetails = await this.AddUserDetails(userId);
                    if (userDetails == null) return false;
                }

                userDetails.Skills = skills;
                userDetails.UpdatedOn = DateTime.UtcNow;
                userDetails.UpdatedBy = userId;

                var ok = await _context.SaveChangesAsync();
                return ok > 0;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user skills", ex);
                throw;
            }
        }

        private async Task<UserDetail> AddUserDetails(long userId)
        {
            var userDetails = new UserDetail
            {
                UserId = userId,
                CreatedBy = userId,
                CreatedOn = DateTime.UtcNow,
                IsActive = true,
            };
            await _context.UserDetails.AddAsync(userDetails);
            var ok = await _context.SaveChangesAsync();
            if(ok > 0) return userDetails;
            return null;
        }
    }
}
