using System.Net.Http.Json;
using System.Text.RegularExpressions;
using CoderAPI.Helper.Interface;
using CoderAPI.WhatsApp.Interface;
using Microsoft.Extensions.Logging;

namespace CoderAPI.WhatsApp.Implementation
{
    public class WhatsappHelper : IWhatsappHelper
    {
        private readonly HttpClient _http;
        private readonly ICustomLogger _logger;

        public WhatsappHelper(HttpClient http, ICustomLogger logger)
        {
            _http = http;
            _logger = logger;
        }


        public async Task<bool> SendMessage(string phone, string message)
        {
            try
            {
                var normalized = NormalizePhone(phone);

                if (normalized == null)
                {
                    _logger.Log(LogLevel.Error,$"Invalid phone number: {phone}");
                    return false;
                }

                var payload = new
                {
                    phone = normalized,
                    message
                };

                _logger.Log(LogLevel.Information,$"Sending WhatsApp message to: {normalized}");

                var response = await _http.PostAsJsonAsync("send", payload);

                if (!response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    _logger.Log(LogLevel.Error, $"WhatsApp sending failed → Status: {response.StatusCode}, Content: {content}");

                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "Exception occurred in WhatsAppHelper.SendMessage",ex);
                return false;
            }
        }

        private string? NormalizePhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return null;

            phone = phone.Trim();

            // Remove spaces, +, -, (), etc.
            phone = Regex.Replace(phone, @"[^\d]", "");

            if (phone.Length == 0)
                return null;

            // If starts with 0 (like 098XXXXXXX), remove leading 0
            if (phone.StartsWith("0"))
                phone = phone.Substring(1);

            // If exactly 10 digits → assume Indian number → prepend 91
            if (phone.Length == 10)
                phone = "91" + phone;

            // If already has country code (e.g., 91XXXXXXXXXX) → accept
            if (phone.Length >= 11 && phone.Length <= 15)
                return phone;

            // If number doesn’t meet expected criteria → reject
            return null;
        }
    }
}
