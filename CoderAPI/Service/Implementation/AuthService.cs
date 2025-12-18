using CoderAPI.DTOs;
using CoderAPI.Helper;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;
using CoderAPI.WhatsApp.Interface;
using MassTransit.Courier.Contracts;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace CoderAPI.Service.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IJwtHelper _jwtHelper;
        private readonly IUserRepository _userRepository;
        private readonly IUserPlanRepository _userPlanRepository;
        private readonly IOtpHelper _otpGenerate;
        private readonly ISendEmailHelper _sendEmailHelper;
        private readonly ICustomLogger _logger;
        private readonly IMessageHelper _messageHelper;
        private readonly IWhatsappHelper _whatsappHelper;
        private readonly IHashingHelper _hashingHelper;

        public AuthService(IJwtHelper jwtHelper, IUserRepository userRepository, ICustomLogger logger, IUserPlanRepository userPlanRepository, IOtpHelper otpGenerate, ISendEmailHelper sendEmailHelper, IMessageHelper messageHelper, IWhatsappHelper whatsappHelper, IHashingHelper hashingHelper)
        {
            _jwtHelper = jwtHelper;
            _userRepository = userRepository;
            _logger = logger;
            _userPlanRepository = userPlanRepository;
            _sendEmailHelper = sendEmailHelper;
            _messageHelper = messageHelper;
            _otpGenerate = otpGenerate;
            _whatsappHelper = whatsappHelper;
            _hashingHelper = hashingHelper;
        }

        public async Task<StatusResponse> CheckUserName(CustomString userName)
        {
            try
            {
                var found = await _userRepository.CheckUserNameAvailable(userName.Value);
                return found ? new StatusResponse
                {
                    Status = false,
                    Message = $"This UserName is already taken"
                } :
                new StatusResponse
                {
                    Status = true,
                    Message = "This username is available"
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to check user name with userName: {userName.Value}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<GenerateOtp> GenerateUserOtp(CustomString phone)
        {
            try
            {
                if (IsValidEmail(phone.Value))
                {
                    var found = await _userRepository.CheckEmailAvailable(phone.Value);
                    if (found) return new GenerateOtp
                    {
                        Status = false,
                        Message = $"The email with {phone.Value} already exists"
                    };
                    var otp = _otpGenerate.GenerateOtp(phone.Value);
                    var mailContent = _messageHelper.GetOtpMessage(otp);
                    var isSend = await _sendEmailHelper.SendTextEmail(phone.Value, mailContent.subject, mailContent.body);
                    if (!isSend)
                    {
                        return new GenerateOtp
                        {
                            Status = false,
                            Message = "Failed to send OTP email. Please try again."
                        };
                    }
                    return new GenerateOtp
                    {
                        Otp = otp,
                        Status = true,
                        Message = "Otp Sent Successfully..!"
                    };
                }
                else
                {
                    var found = await _userRepository.CheckPhoneNumberAvailable(phone.Value);
                    if (found) return new GenerateOtp
                    {
                        Status = false,
                        Message = $"The phone with {phone.Value} is already registered"
                    };
                    var otp = _otpGenerate.GenerateOtp(phone.Value);
                    var whatsappContent = _messageHelper.GetOtpMessage(otp);
                    var isSend = await _whatsappHelper.SendMessage(phone.Value, whatsappContent.body);
                    return new GenerateOtp
                    {
                        Otp = otp,
                        Status = true,
                        Message = "Otp sent successfully..!"
                    };
                }
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to generate user otp for phone: {phone}");
                throw;
            }
        }

        public async Task<LoginResponse> Login(LoginRequest request)
        {
            try
            {
                UserDto user;
                switch(InputValidator.DetectInputType(request.UserName))
                {
                    case "email":
                        user = await _userRepository.GetUserByEmail(request.UserName);
                        break;
                    case "phone":
                        user = await _userRepository.GetUserByPhone(request.UserName);
                        break;
                    case "username":
                        user = await _userRepository.GetUserByUserName(request.UserName);
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
                if(user == null || !_hashingHelper.Verify(request.Password, user.LoginPassword))
                {
                    return new LoginResponse
                    {
                        Status = false,
                        Message = "Incorrect UserName or Password",
                        Token = "",
                        UserName = ""
                    };
                }
                var subscription = await _userPlanRepository.GetUserPlanLevelAndExpiry(user.UserId);
                var token = _jwtHelper.GenerateToken(user.UserId, user.UserName, subscription.Item1,subscription.Item2);
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
                request.LoginPassword = _hashingHelper.Hash(request.LoginPassword);
                var response = await _userRepository.RegisterUser(request);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to register user {request.UserName}", ex);
                throw;
            }
        }

        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            string emailRegexPattern = @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";
            if (Regex.IsMatch(email, emailRegexPattern))
            {
                try
                {
                    var mailAddress = new MailAddress(email);
                    return true;
                }
                catch (FormatException)
                {
                    return false;
                }
            }
            return false;
        }

        public Task<StatusResponse> ValidateUserOtp(ValidateOtp request)
        {
            try
            {
                var ok = _otpGenerate.ValidateOtp(request.Phone, request.Otp);
                if (!ok)
                {
                    return Task.FromResult(new StatusResponse
                    {
                        Status = false,
                        Message = "Invalid or expired OTP."
                    });
                }

                return Task.FromResult(new StatusResponse
                {
                    Status = true,
                    Message = "OTP validated successfully."
                });
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to validate otp for phone: {request.Phone}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }
    }
}
