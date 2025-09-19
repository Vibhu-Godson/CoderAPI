using CoderAPI.Messages;

namespace CoderAPI.MicroService.Queue.Interface
{
    public interface IQueuePublisher
    {
        Task PublishRunCodeRequest(RunCodeRequest runCodeRequest);
        Task PublishLLMAnalyzeRequest(LLMAnalysisRequest promt);
    }
}
