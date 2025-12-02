using CoderAPI.Helper.Interface;
using MimeKit;
using MailKit.Net.Smtp;

namespace CoderAPI.Helper.Implementation
{
    public class SendEmailHelper : ISendEmailHelper
    {
        private readonly string _smtpHost = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _fromEmail;
        private readonly string _appPassword;
        private readonly ICustomLogger _logger;

        public SendEmailHelper(IConfiguration _config, ICustomLogger logger)
        {
            _fromEmail = _config["Email:From"];
            _appPassword = _config["Email:AppPassword"];
            _logger = logger;
        }

        public async Task<bool> SendTextEmail(string sendTo, string subject, string message)
        {
            try
            {
                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress("AmCoder.in", _fromEmail));
                mimeMessage.To.Add(new MailboxAddress("", sendTo));
                mimeMessage.Subject = subject;
                mimeMessage.Body = new TextPart("plain")
                {
                    Text = message
                };

                using var client = new SmtpClient();
                await client.ConnectAsync(_smtpHost, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_fromEmail, _appPassword);
                await client.SendAsync(mimeMessage);
                await client.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Failed to send email to {sendTo}", ex);
                throw;
            }
        }
    }
}
