using CoderAPI.DTOs;
using CoderAPI.Helper;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;

namespace CoderAPI.Service.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IJwtHelper _jwtHelper;
        private readonly IUserRepository _userRepository;
        private readonly ICustomLogger _logger;

        public AuthService(IJwtHelper jwtHelper, IUserRepository userRepository, ICustomLogger logger)
        {
            _jwtHelper = jwtHelper;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            try
            {
                UserDto user;
                switch(InputValidator.DetectInputType(request.UserName))
                {
                    case "email":
                        user = await _userRepository.GetUserByEmailAndPassword(request.UserName, request.Password);
                        break;
                    case "phone":
                        user = await _userRepository.GetUserByPhoneAndPassword(request.UserName, request.Password);
                        break;
                    case "username":
                        user = await _userRepository.GetUserByUserNameAndPassword(request.UserName, request.Password);
                        break;
                    default:
                        return new LoginResponse
                        {
                            Status = false,
                            Message = "Invalid UserName format",
                            Token = "",
                            UserName = ""
                        };
                }
                if(user == null)
                {
                    return new LoginResponse
                    {
                        Status = false,
                        Message = "Incorrect UserName or Password",
                        Token = "",
                        UserName = ""
                    };
                }
                var token = _jwtHelper.GenerateToken(user.UserId, user.UserName);
                return new LoginResponse
                {
                    Status = true,
                    Message = $"Welcome {user.FirstName}",
                    Token = token,
                    UserName = user.UserName
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to login user {request.UserName}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> RegisterUser(UserDto request)
        {
            try
            {
                var response = await _userRepository.RegisterUser(request);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to register user {request.UserName}", ex);
                throw;
            }
        }
    }
}
