using CoderAPI.Helper.Interface;

namespace CoderAPI.Helper.Implementation
{
    public class CustomLogger : ICustomLogger
    {
        public void Log(LogLevel level, string message, Exception? ex = null)
        {
            var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{level}] {message}";

            if (ex != null)
            {
                logMessage += $" | Exception: {ex.Message} | StackTrace: {ex.StackTrace}";
            }

            // For now log to console, later we can extend to File/DB/Serilog
            Console.WriteLine(logMessage);
        }
    }
}
