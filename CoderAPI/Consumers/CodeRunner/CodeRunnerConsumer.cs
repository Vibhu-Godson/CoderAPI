using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;
using MassTransit;

namespace CoderAPI.Consumers.CodeRunner
{
    public class CodeRunnerConsumer : IConsumer<RunCodeRequest>
    {
        private readonly IJudge0Service _judge0Service;

        public Task Consume(ConsumeContext<RunCodeRequest> context)
        {
            throw new NotImplementedException();
        }
    }
}
