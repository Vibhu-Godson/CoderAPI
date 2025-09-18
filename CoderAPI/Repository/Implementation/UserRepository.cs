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
                var user = new User
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
