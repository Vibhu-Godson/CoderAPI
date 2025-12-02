using CoderAPI.DTOs.codeRunner;
using CoderAPI.Messages;
using CoderAPI.MicroService.Queue.Interface;
using MassTransit;
using MassTransit.Transports;

namespace CoderAPI.MicroService.Queue.Implementation
{
    public class QueuePublisher : IQueuePublisher
    {
        private readonly IPublishEndpoint _endpoint;

        public QueuePublisher(IPublishEndpoint publishEndpoint) => _endpoint = publishEndpoint;

        public Task PublishLLMAnalyzeRequest(LLMAnalysisRequest promt) => _endpoint.Publish(promt);

        public Task PublishRunCodeRequest(Judge0CodeRunRequest runCodeRequest) => _endpoint.Publish(runCodeRequest);
    }
}
