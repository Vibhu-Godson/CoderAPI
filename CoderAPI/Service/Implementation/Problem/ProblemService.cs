using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.codeRunner;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Hubs;
using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Repository.Interface.Problem;
using CoderAPI.Service.Interface.Problem;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using static MassTransit.ValidationResultExtensions;

namespace CoderAPI.Service.Implementation.Problem
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly IProblemDetailRepository _problemDetailRepository;
        private readonly IUserSolutionRepository _userSolutionRepository;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IJudge0Service _judge0Service;
        private readonly IHubContext<CodeExecutionHub> _hubContext;
        private readonly IUserProblemSessionRepository _userProblemSessionRepository;
        private readonly ICustomLogger _logger;

        public ProblemService(IProblemRepository problemRepository, IUserSolutionRepository userSolutionRepository, ITestCaseRepository testCaseRepository, ICustomLogger logger, IJudge0Service judge0Service, IHubContext<CodeExecutionHub> hubContext, IUserProblemSessionRepository userProblemSessionRepository, IProblemDetailRepository problemDetailRepository)
        {
            _problemRepository = problemRepository;
            _userSolutionRepository = userSolutionRepository;
            _testCaseRepository = testCaseRepository;
            _judge0Service = judge0Service;
            _logger = logger;
            _hubContext = hubContext;
            _userProblemSessionRepository = userProblemSessionRepository;
            _problemDetailRepository = problemDetailRepository;
        }

        public async Task<CreateUserSessionResponse> GetActiveUserProblemSession(long ProblemId, long userId)
        {
            try
            {
                var response = await _userProblemSessionRepository.GetActiveUserProblemSession(ProblemId, userId);
                return (response >= 0) ?
                     new CreateUserSessionResponse
                    {
                        Status = true,
                        Message = "Found Active Problem Session",
                        UserProblemSessionId = response
                    }:
                    new CreateUserSessionResponse
                    {
                        Status = false,
                        Message = "Couldn't get Active Problem Session",
                    };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get Active Problem Session for userId: {userId}, ProblemId: {ProblemId}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<ProblemDto> GetProblemById(long problemId, long userId)
        {
            try
            {
                var response = await _problemRepository.GetProblemById(problemId, userId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get problem by Id: {problemId}", ex);
                throw;
            }
        }

        public async Task<ListPageDto<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId)
        {
            try
            {
                var response = await _problemRepository.GetProblems(query, pageNumber, pageSize, userId);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error,$"ServerError: unable to get all problems", ex);
                throw;
            }
        }

        public async Task<StatusResponse> MarkUserSessionComplete(long UserSessionId, long userId)
        {
            try
            {
                var status = await _userProblemSessionRepository.MarkUserSessionComplete(UserSessionId, userId);
                return new StatusResponse
                {
                    Status = status,
                    Message = "User Solution Marked completed..!"
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to mark user session complete for userSessionId: {UserSessionId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<RunCodeResponse> RunCode(RunCodeRequest request, long userId)
        {
            try
            {
                // Adding user's solution into db 
                var userSolution = new UserSolution
                {
                    UserId = userId,
                    ProblemId = request.ProblemId,
                    UserProblemSessionId = request.UserProblemSessionId,
                    UserSolutionCode = request.Code,
                    SelectedLanguage = request.Language,
                    StatusDescription = RunCodeStatus.Pending.ToString(),
                    Result = RunCodeStatus.Pending.ToString(),
                    SubmissionDate = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                    IsSubmit = request.IsSubmit,
                };
                userSolution.UserSolutionId = await _userSolutionRepository.AddUserSolution(userSolution);

                // Getting all test cases for the problem
                var testCases = await _testCaseRepository.GetTestcasesByProblem(request.ProblemId, request.IsSubmit);

                request.Code = (await _problemDetailRepository.GetHiddenCode(request.ProblemId, request.Language)).Value + "\n" + request.Code;

                // Collect all test results
                var testCaseResults = new List<TestCaseResultDto>();

                // Run test cases sequentially one by one
                foreach (var tc in testCases)
                {
                    // added user test case result with pending status in db 
                    var userTestCaseResult = new UserTestCaseResult
                    {
                        UserSolutionId = userSolution.UserSolutionId,
                        TestCaseId = tc.TestCaseId,
                        Status = RunCodeStatus.Pending.ToString(),
                        CreatedBy = userId,
                        CreatedOn = DateTime.UtcNow,
                    };
                    var userTestCaseResultId = await _testCaseRepository.AddUserTestCaseResult(userTestCaseResult);

                    var testResult = new TestCaseResultDto
                    {
                        UserTestCaseResultId = userTestCaseResultId,
                        TestCaseId = tc.TestCaseId,
                        Input = tc.TestCaseDetail,
                        ExpectedOutput = tc.ExpectedOutput,
                        Status = RunCodeStatus.Pending.ToString()
                    };

                    try
                    {
                        // Execute test case directly via Judge0 Service
                        var judgeRequest = new Judge0CodeRunRequest
                        {
                            SourceCode = request.Code,
                            Language = request.Language,
                            Input = tc.TestCaseDetail,
                            ExpectedOutput = tc.ExpectedOutput,
                            UserSolutionId = userSolution.UserSolutionId,
                            UserProblemSessionId = userSolution.UserProblemSessionId,
                            TestCaseId = tc.TestCaseId,
                        };

                        // Call Judge0 service directly - no queue anymore
                        var result = await _judge0Service.RunCode(judgeRequest);

                        // Update test case result with actual execution result
                        var (userTestCaseResultIdUpdated, remaining) = await _testCaseRepository.UpdateUserTestCaseResult(
                            userSolution.UserSolutionId,
                            tc.TestCaseId,
                            result.Status,
                            result.Stdout,
                            result.Stderr,
                            result.CompileOutput,
                            result.ExecutionTime,
                            result.MemoryUsed
                        );

                        // Update the result object
                        testResult.UserTestCaseResultId = userTestCaseResultIdUpdated;
                        testResult.Status = result.Status;
                        testResult.ActualOutput = result.Stdout;
                        testResult.ExecutionTime = result.ExecutionTime;
                        testResult.MemoryUsed = result.MemoryUsed;
                        testResult.Stderr = result.Stderr;
                        testResult.CompileOutput = result.CompileOutput;

                        // If all test cases completed, mark solution as completed
                        if (remaining == 0)
                        {
                            await _userSolutionRepository.MarkUserSolutionCompleted(userSolution.UserSolutionId);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Log(LogLevel.Error, $"Error executing test case {tc.TestCaseId}: {ex.Message}", ex);

                        // Update the result object with error
                        testResult.Status = "Error";
                        testResult.Stderr = ex.Message;
                    }

                    testCaseResults.Add(testResult);
                }

                return new RunCodeResponse
                {
                    Message = "Code execution completed",
                    Status = true,
                    UserSolutionId = userSolution.UserSolutionId,
                    TestCaseResults = testCaseResults
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServerError: unable to run code", ex);
                return new RunCodeResponse
                {
                    Message = "Failed to process the code",
                    Status = false,
                    TestCaseResults = new()
                };
            }
        }

        public async Task<CreateUserSessionResponse> StartNewUserProblemSession(long ProblemId, long userId)
        {
            try
            {
                var userProblemSessionId = await _userProblemSessionRepository.CreateUserProblemSession(ProblemId, userId);
                if(userProblemSessionId <= 0)
                {
                    _logger.Log(LogLevel.Error, $"ServerError: Unable to Start new User problem Session for problemId: {ProblemId} and userId:{userId}");
                    throw new Exception("Unable to start new session");
                }

                _hubContext.Groups.AddToGroupAsync(userId.ToString(), userProblemSessionId.ToString()).Wait();
                return new CreateUserSessionResponse
                {
                    Message = "New session started successfully",
                    Status = true,
                    UserProblemSessionId = userProblemSessionId
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to Start new User problem Session for problemId: {ProblemId} and userId:{userId}", ex);
                throw;
            }
        }
    }
}
