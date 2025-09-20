using CoderAPI.DTOs.codeRunner;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;

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
        }

        public async Task<Judge0Result> RunCode(Judge0CodeRunRequest request)
        {
            try
            {
                var baseUrl = _config["Judge0:BaseUrl"];
                var url = $"{baseUrl}/submission?base64_encoded=false&wait=true";

                var payload = new
                {
                    source_code = request.SourceCode,
                    language_id = MapLanguageToId(request.Language),
                    stdin = request.Input,
                    expected_output = request.ExpectedOutput
                };

                var response = await _http.PostAsJsonAsync(url, payload);
                response.EnsureSuccessStatusCode();

                var apiResponse = await response.Content.ReadFromJsonAsync<Judge0ApiResponse>();

                return new Judge0Result
                {
                    SubmissionId = apiResponse.Token,
                    Status = apiResponse.Status?.Description ?? "Unknown",
                    Stdout = apiResponse.Stdout,
                    Stderr = apiResponse.Stderr,
                    CompileOutput = apiResponse.Compile_Output,
                    ExitCode = apiResponse.Exit_Code ?? -1,
                    ExecutionTime = double.TryParse(apiResponse.Time, out var t) ? t : null,
                    MemoryUsed = apiResponse.Memory,
                    Time = double.TryParse(apiResponse.Time, out var t2) ? (long)(t2 * 1000) : 0, // ms
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
                _ => throw new ArgumentException($"Unsupported language: {lang}")
            };
        }
    }
}
