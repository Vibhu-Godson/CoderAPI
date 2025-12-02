namespace CoderAPI.Helper.Interface
{
    public interface ISendEmailHelper
    {
        Task<bool> SendTextEmail(string sendTo, string subject, string message);

    }
}
