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

        public async Task<string> GetRoleName(long userId)
        {
            try
            {
                var roleName = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.CurrentRole)
                    .FirstOrDefaultAsync();
                
                return roleName;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get Role Name for userId: {userId}", ex);
                throw;
            }
        }

        public async Task<string> GetUserEducation(long userId)
        {
            try
            {
                var education = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.LatestEducation)
                    .FirstOrDefaultAsync();

                return education;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Education for userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<string> GetUserExperience(long userId)
        {
            try
            {
                var exp = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.LatestExperience)
                    .FirstOrDefaultAsync();

                return exp;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Experience for userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<string> GetUserMotivation(long userId)
        {
            try
            {
                var motivation = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.LatestEducation)
                    .FirstOrDefaultAsync();

                return motivation;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Motivation for userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<string> GetUserProject(long userId)
        {
            try
            {
                var project = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.LatestProject)
                    .FirstOrDefaultAsync();

                return project;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Project for userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<string> GetUserSkills(long userId)
        {
            try
            {
                var skills = await _context.UserDetails
                    .Where(ud => ud.UserId == userId)
                    .Select(ud => ud.LatestEducation)
                    .FirstOrDefaultAsync();

                return skills;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Skills for userId: {userId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<Dictionary<string,string>> UserOnboardingStatus(long userId)
        {
            try
            {
                var userDetails = await _context.UserDetails
                    .AsNoTracking()
                    .Where(ud => ud.UserId == userId)
                    .FirstOrDefaultAsync();

                if (userDetails == null) return [];
                var obj = new Dictionary<string, string>();
                if (userDetails.CurrentRole != null) obj["role"] = userDetails.CurrentRole;
                if (userDetails.LatestEducation != null) obj["education"] = userDetails.LatestEducation;
                if (userDetails.LatestExperience != null) obj["Experience"] = userDetails.LatestExperience;
                if (userDetails.LatestProject != null) obj["Project"] = userDetails.LatestProject;
                if (userDetails.Skills != null) obj["Skills"] = userDetails.Skills;
                if (userDetails.Motivation != null) obj["Motivation"] = userDetails.Motivation;

                return obj;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get User Education for userId: {userId}\n{ex.Message}", ex);
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
