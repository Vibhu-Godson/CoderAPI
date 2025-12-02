using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public Task<bool> CheckEmailAvailable(string email)
        {
            try
            {
                var found = _context.Users
                    .AnyAsync(u => u.Email == email);
                return found;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to check userName available for: {email}\n{ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }

        public Task<bool> CheckPhoneNumberAvailable(string phone)
        {
            try
            {
                var found = _context.Users
                    .AnyAsync(u => u.PhoneNumber == phone);
                return found;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to check userName available for: {phone}\n{ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }

        public Task<bool> CheckUserNameAvailable(string userName)
        {
            try
            {
                var found = _context.Users
                    .AnyAsync(u => u.UserName == userName);
                return found;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to check userName available for: {userName}\n{ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> CheckUsernameAvailablity(string username)
        {
            try
            {
                var got = await _context.Users.AnyAsync(u => u.UserName == username);
                return !got;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to check username availability for {username}", ex);
                throw;
            }
        }

        public async Task<UserDto> GetUserByEmailAndPassword(string email, string password)
        {
            try
            {
                var user = await _context.Users.Where(u => u.Email == email && u.LoginPassword == password)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber,
                        ProfileImage = u.ProfileImage,
                        Country = u.Country
                    }).FirstOrDefaultAsync();
                return user;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user by email {email}", ex);
                throw;
            }
        }

        public async Task<UserDto> GetUserByPhoneAndPassword(string phone, string password)
        {
            try
            {
                var user = await _context.Users.Where(u => u.PhoneNumber == phone && u.LoginPassword == password)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber,
                        ProfileImage = u.ProfileImage,
                        Country = u.Country
                    }).FirstOrDefaultAsync();
                return user;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user by phone {phone}", ex);
                throw;
            }
        }

        public async Task<UserDto> GetUserByUserNameAndPassword(string username, string password)
        {
            try
            {
                var user = await _context.Users.Where(u => u.UserName == username && u.LoginPassword == password)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        UserName = u.UserName,
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber,
                        ProfileImage = u.ProfileImage,
                        Country = u.Country
                    }).FirstOrDefaultAsync();
                return user;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get user by username {username}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> RegisterUser(UserDto request)
        {
            try
            {
                var user = new DBOs.User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    UserName = request.UserName,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    LoginPassword = request.LoginPassword,
                    ProfileImage = request.ProfileImage,
                    Country = request.Country,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = 0,
                    IsActive = true,
                };
                await _context.Users.AddAsync(user);
                var ok = await _context.SaveChangesAsync();
                return ok > 0
                    ? new StatusResponse { Status = true, Message = "User registered successfully" }
                    : new StatusResponse { Status = false, Message = "User registration failed" };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to register user {request.UserName}", ex);
                throw;
            }
        }
    }
}
