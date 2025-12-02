namespace CoderAPI.Helper.Interface
{
    public interface IOtpHelper
    {
        string GenerateOtp(string phone);
        bool ValidateOtp(string phone, string otp);
    }
}
