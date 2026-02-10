using CoderAPI.DTOs.codeRunner;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;
using System.Net.Http.Headers;

namespace CoderAPI.MicroService.Judge0.Implementation
{
    public class Judge0Service : IJudge0Service
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        private readonly ICustomLogger _logger;

        public Judge0Service(HttpClient http, IConfiguration config, ICustomLogger logger)
        {
            _http = http;
            _config = config;
            _logger = logger;
            _http.DefaultRequestHeaders.Accept.Clear();
            _http.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );

        }

        public async Task<Judge0Result> RunCode(Judge0CodeRunRequest request)
        {
            try
            {
                var baseUrl = _config["Judge:BaseUrl"];
                var url = $"{baseUrl}/submissions?base64_encoded=true&wait=true";

                var payload = new
                {
                    source_code = B64(request.SourceCode),
                    language_id = MapLanguageToId(request.Language),
                    stdin = B64(request.Input)
                };

                var response = await _http.PostAsJsonAsync(url, payload);
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.Log(LogLevel.Error, $"Judge0 error {response.StatusCode}: {errorBody}");
                    throw new Exception($"Judge0 returned {response.StatusCode}: {errorBody}");
                }

                var apiResponse = await response.Content.ReadFromJsonAsync<Judge0ApiResponse>();

                return new Judge0Result
                {
                    SubmissionId = apiResponse.Token, // ❌ do NOT decode
                    Status = apiResponse.Status?.Description ?? "Unknown", // ❌ do NOT decode

                    Stdout = Decode(apiResponse.Stdout),
                    Stderr = Decode(apiResponse.Stderr),
                    CompileOutput = Decode(apiResponse.Compile_Output),

                    ExitCode = apiResponse.Exit_Code ?? -1,
                    ExecutionTime = double.TryParse(apiResponse.Time, out var t) ? t : null,
                    MemoryUsed = apiResponse.Memory,
                    Time = double.TryParse(apiResponse.Time, out var t2) ? (long)(t2 * 1000) : 0,
                    Memory = apiResponse.Memory ?? 0
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"QueueError: unable to Run code", ex);
                throw;
            }
        }
        private int MapLanguageToId(string lang)
        {
            return lang.ToLower() switch
            {
                "c" => 50,
                "cpp" => 54,
                "java" => 62,
                "python" => 71,
                "csharp" => 51,
                "mysql" => 82,
                _ => throw new ArgumentException($"Unsupported language: {lang}")
            };
        }
        static string B64(string s)
        {
            return Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes(s ?? "")
            );
        }

        string Decode(string? s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            return System.Text.Encoding.UTF8.GetString(
                Convert.FromBase64String(s)
            );
        }

    }
}
