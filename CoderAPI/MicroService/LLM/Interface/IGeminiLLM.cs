namespace CoderAPI.MicroService.LLM.Interface
{
    public interface IGeminiLLM
    {
        Task<string> GetGeminiResponse(string prompt);
    }
}
