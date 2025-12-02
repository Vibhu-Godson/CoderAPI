using CoderAPI.Helper.Interface;

namespace CoderAPI.Helper.Implementation
{
    public class MessageHelper : IMessageHelper
    {
        public (string subject, string body) GetOtpMessage(string otp)
        {
            var subject = "Your One-Time Password (OTP) Code";
            var body = $@"
Your one-time password for logging into your account is: {otp}
This otp is valid for next 10 minutes.
If you did not request this code, please ignore this message.
Thank you,
Team AmCoder.in
";
            return (subject, body);
        }
    }
}
