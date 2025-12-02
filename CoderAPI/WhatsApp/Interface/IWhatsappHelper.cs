namespace CoderAPI.WhatsApp.Interface
{
    public interface IWhatsappHelper
    {
        Task<bool> SendMessage(string phone, string message);
    }
}
