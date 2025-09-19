using CoderAPI.DTOs.codeRunner;
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

        public Task<Judge0Result> RunCode(RunCodeRequest request)
        {
            try
            {
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Judge0Error: unable to run code", ex);
                throw;
            }
        }
        private int MapLanguageToJudge0Id(string lang)
        {
            // Map "cpp", "python" -> judge0 ids
            return 71; // example
        }

        private string MapJudge0Status(int id)
        {
            // Example mapping
            return id switch
            {
                1 => "In Queue",
                2 => "Processing",
                3 => "Accepted",
                4 => "WrongAnswer",
                5 => "TimeLimitExceeded",
                6 => "CompilationError",
                7 => "RuntimeError",
                _ => "Unknown"
            };
        }
    }
}
