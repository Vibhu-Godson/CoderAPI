using CoderAPI.DTOs.codeRunner;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Hubs;
using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;
using CoderAPI.Repository.Interface;
using MassTransit;
using Microsoft.AspNetCore.SignalR;

namespace CoderAPI.Consumers.CodeRunner
{
    public class CodeRunnerConsumer : IConsumer<Judge0CodeRunRequest>
    {
        private readonly IJudge0Service _judge0Service;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IUserSolutionRepository _userSolutionRepository;
        private readonly IHubContext<CodeExecutionHub> _hubContext;
        private readonly ICustomLogger _logger;

        public CodeRunnerConsumer(IJudge0Service judge0Service, ICustomLogger logger, ITestCaseRepository testCaseRepository, IUserSolutionRepository userSolutionRepository, IHubContext<CodeExecutionHub> hubContext)
        {
            _judge0Service = judge0Service;
            _logger = logger;
            _testCaseRepository = testCaseRepository;
            _userSolutionRepository = userSolutionRepository;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<Judge0CodeRunRequest> context)
        {
            try
            {
                var request = context.Message;
                var result = await _judge0Service.RunCode(request);
                var (userTestCaseResultId, remaining) = await _testCaseRepository.UpdateUserTestCaseResult(
                    request.UserSolutionId,
                    request.TestCaseId,
                    result.Status,
                    result.Stdout,
                    result.Stderr,
                    result.CompileOutput,
                    result.ExecutionTime,
                    result.MemoryUsed
                );

                await _hubContext.Clients.Group(request.UserProblemSessionId.ToString())
                    .SendAsync("ReceiveTestCaseResult", new
                    {
                        UserTestCaseResultId = userTestCaseResultId,
                        TestCaseId = request.TestCaseId,
                        Input = request.Input,
                        ExpectedOutput = request.ExpectedOutput,
                        Status = result.Status,
                        Stdout = result.Stdout,
                        Stderr = result.Stderr,
                        CompileOutput = result.CompileOutput,
                        ExecutionTime = result.ExecutionTime,
                        MemoryUsed = result.MemoryUsed
                    });

                if (remaining == 0)
                {
                    var status = await _userSolutionRepository.MarkUserSolutionCompleted(request.UserSolutionId);
                    if(status.Item1)
                    await _hubContext.Clients.Group(request.UserProblemSessionId.ToString())
                        .SendAsync("ExecutionCompleted", new
                        {
                            UserSolutionId = request.UserSolutionId,
                            Status = status.Item2
                        });
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to run test case", ex);
                throw;
            }
        }
    }
}
