using CoderAPI.DTOs.codeRunner;
using CoderAPI.Messages;

namespace CoderAPI.MicroService.Queue.Interface
{
    public interface IQueuePublisher
    {
        Task PublishRunCodeRequest(Judge0CodeRunRequest runCodeRequest);
        Task PublishLLMAnalyzeRequest(LLMAnalysisRequest promt);
    }
}
