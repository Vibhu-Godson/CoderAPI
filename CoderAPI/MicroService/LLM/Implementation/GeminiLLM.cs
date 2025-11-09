using CoderAPI.Helper.Interface;
using CoderAPI.MicroService.LLM.Interface;
using Google.Cloud.AIPlatform.V1;
using Google.Protobuf.WellKnownTypes;
using System.Text;
using System.Text.Json;

namespace CoderAPI.MicroService.LLM.Implementation
{
    public class GeminiLLM : IGeminiLLM
    {
        private readonly HttpClient _httpClient;
        private readonly ICustomLogger _logger;
        private readonly string apiKey;
        private readonly IConfiguration _configuration;

        public GeminiLLM(HttpClient httpClient, ICustomLogger logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
            // get it from appsettings.json "LLM:ApiKey";
            this.apiKey = _configuration["LLM:ApiKey"] ?? "";
        }

        public async Task<string> GetGeminiResponse(string prompt)
        {
            try
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };
                var request = new HttpRequestMessage(
                    HttpMethod.Post,
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
                );
                request.Headers.Add("X-goog-api-key", apiKey);
                request.Content = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.SendAsync( request );
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else throw new HttpRequestException($"Error: {response.StatusCode} Couldn't connect with server");
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to get Gemini response", ex);
                throw;
            }
        }
    }
}