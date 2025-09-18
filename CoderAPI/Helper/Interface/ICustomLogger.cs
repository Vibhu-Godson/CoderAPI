namespace CoderAPI.Helper.Interface
{
    public interface ICustomLogger
    {
        void Log(LogLevel level, string message, Exception? ex = null);
    }
}
