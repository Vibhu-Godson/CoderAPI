using CoderAPI.Helper.Interface;
using CoderAPI.MicroService.LLM.Interface;
using System.Text;
using System.Text.Json;

namespace CoderAPI.MicroService.LLM.Implementation
{
    /// <summary>
    /// OpenRouter.ai LLM Implementation
    /// Provides access to multiple LLM models through OpenRouter's unified API
    /// API Key: Stored in appsettings.json at "LLM:ApiKey"
    /// </summary>
    public class GeminiLLM : IGeminiLLM
    {
        private readonly HttpClient _httpClient;
        private readonly ICustomLogger _logger;
        private readonly string _apiKey;
        private readonly IConfiguration _configuration;
        private const string OpenRouterBaseUrl = "https://openrouter.ai/api/v1";
        private string DefaultModel = ""; // Cost-effective model
        
        public GeminiLLM(HttpClient httpClient, ICustomLogger logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
            // API key from appsettings.json at "LLM:ApiKey"
            DefaultModel = _configuration["LLM:Model"] ?? "";
            _apiKey = _configuration["LLM:ApiKey"] ?? "";
            
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger.Log(LogLevel.Warning, "LLM API key is not configured. Please set 'LLM:ApiKey' in appsettings.json");
            }
        }

        /// <summary>
        /// Sends a prompt to OpenRouter.ai and returns the response
        /// Maintains compatibility with existing Gemini response format
        /// </summary>
        public async Task<string> GetGeminiResponse(string prompt)
        {
            try
            {
                // Ensure the model is NOT empty. 
                // If this is null/empty, OpenRouter returns a 404.
                var modelId = "meta-llama/llama-3-8b-instruct";


                var requestBody = new
                {
                    model = modelId, // MUST BE A VALID STRING
                    messages = new[]
                    {
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.7,
                    max_tokens = 2000
                };

                var jsonPayload = JsonSerializer.Serialize(requestBody);

                using var request = new HttpRequestMessage(
                    HttpMethod.Post,
                    "https://openrouter.ai/api/v1/chat/completions"
                );


                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey.Trim());

                request.Headers.Add("HTTP-Referer", "https://amcoder.in");
                request.Headers.Add("X-Title", "AmCoder-LLM");

                request.Content = new StringContent(
                    jsonPayload,
                    Encoding.UTF8,
                    "application/json"
                );


                var response = await _httpClient.SendAsync(request);
                //var response = await _httpClient.SendAsync(request);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    // Convert OpenRouter response to Gemini-compatible format for backward compatibility
                    return ConvertOpenRouterToGeminiFormat(responseContent);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.Log(LogLevel.Error, $"OpenRouter API Error: {response.StatusCode} - {errorContent}");
                    throw new HttpRequestException($"Error: {response.StatusCode} - {errorContent}");
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to get LLM response from OpenRouter", ex);
                throw;
            }
        }

        /// <summary>
        /// Converts OpenRouter response format to Gemini format to maintain compatibility
        /// with existing GeminiHelper parsing logic
        /// </summary>
        private string ConvertOpenRouterToGeminiFormat(string openRouterResponse)
        {
            try
            {
                var openRouterData = JsonSerializer.Deserialize<OpenRouterResponse>(
                    openRouterResponse,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (openRouterData?.Choices == null || openRouterData.Choices.Count == 0)
                {
                    throw new Exception("No choices returned by OpenRouter");
                }

                // Extract the actual message content
                var messageContent = openRouterData.Choices[0].Message?.Content ?? "";

                // Convert to Gemini-compatible format
                var geminiFormat = new
                {
                    candidates = new[]
                    {
                        new
                        {
                            content = new
                            {
                                parts = new[]
                                {
                                    new { text = messageContent }
                                }
                            }
                        }
                    }
                };

                return JsonSerializer.Serialize(geminiFormat);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Failed to convert OpenRouter response to Gemini format", ex);
                throw;
            }
        }
    }

    /// <summary>
    /// OpenRouter API Response Structure
    /// </summary>
    internal class OpenRouterResponse
    {
        public List<Choice> Choices { get; set; }
    }

    internal class Choice
    {
        public Message Message { get; set; }
    }

    internal class Message
    {
        public string Content { get; set; }
    }
}