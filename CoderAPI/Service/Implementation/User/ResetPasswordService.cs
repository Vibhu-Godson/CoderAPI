using CoderAPI.DTOs;
using CoderAPI.Helper;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface.User;
using CoderAPI.WhatsApp.Interface;

namespace CoderAPI.Service.Implementation.User
{
    public class ResetPasswordService : IResetPasswordService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICustomLogger _logger;
        private readonly IOtpHelper _otpHelper;
        private readonly ISendEmailHelper _sendEmailHelper;
        private readonly IWhatsappHelper _whatsappHelper;
        private readonly IMessageHelper _messageHelper;

        public ResetPasswordService(IUserRepository userRepository, ICustomLogger logger, IOtpHelper otpHelper, ISendEmailHelper sendEmailHelper, IWhatsappHelper whisappHelper, IMessageHelper messageHelper)
        {
            _userRepository = userRepository;
            _logger = logger;
            _otpHelper = otpHelper;
            _sendEmailHelper = sendEmailHelper;
            _whatsappHelper = whisappHelper;
            _messageHelper = messageHelper;
        }

        public async Task<StatusResponse> SendPasswordResetOtp(CustomString email)
        {
            try
            {
                var contactType = InputValidator.DetectInputType(email.Value);
                if (contactType == "email")
                {
                    var IsAvialble = await _userRepository.CheckEmailAvailable(email.Value);
                    if (IsAvialble)
                    {
                        var otp = _otpHelper.GenerateOtp(email.Value);
                        var content = _messageHelper.GetOtpMessage(otp);
                        var sent = await _sendEmailHelper.SendTextEmail(email.Value, content.subject, content.body);
                        return new StatusResponse
                        {
                            Status = sent,
                            Message = sent ? $"OTP sent Successfully..!" : $"Unable to Send OTP, Please try again",
                        };
                    }
                    return new StatusResponse
                    {
                        Status = false,
                        Message = $"Email: {email.Value} is Not Registered With Us"
                    };
                }
                else if (contactType == "phone")
                {
                    var IsAvailable = await _userRepository.CheckPhoneNumberAvailable(email.Value);
                    if (!IsAvailable) return new StatusResponse
                    {
                        Status = false,
                        Message = $"Whatsapp Number: {email.Value} is Not Registered with Us"
                    };
                    var otp = _otpHelper.GenerateOtp(email.Value);
                    var content = _messageHelper.GetOtpMessage(otp);
                    var IsSent = await _whatsappHelper.SendMessage(email.Value, content.body);
                    return new StatusResponse
                    {
                        Status = IsSent,
                        Message = IsSent ? $"OTP sent Successfully..!" : $"Unable to Send OTP, Please try again"
                    };
                }
                else return new StatusResponse
                {
                    Status = false,
                    Message = $"Please Enter Email Or Whatsapp Number"
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to Send Password Reset OTP for {email.Value}\n{ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }
    }
}
