using CoderAPI.Messages;

namespace CoderAPI.Service.Interface
{
    public interface IAiAnalysisService
    {
        Task<LLMResponse> AiChat(LLMAnalysisRequest request);
        Task<bool> CanChat(long userId);
    }
}
