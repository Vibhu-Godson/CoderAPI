namespace CoderAPI.Helper.Interface
{
    public interface IMessageHelper
    {
        (string subject, string body) GetOtpMessage(string otp);
    }
}
