using CoderAPI.Messages;
using MassTransit;

namespace CoderAPI.Consumers.LLM
{
    public class LLMConsumer : IConsumer<LLMAnalysisRequest>
    {
        public Task Consume(ConsumeContext<LLMAnalysisRequest> context)
        {
            throw new NotImplementedException();
        }
    }
}
