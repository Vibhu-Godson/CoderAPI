using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.DTOs.TestCase;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.MicroService.Judge0.Interface;
using CoderAPI.Repository.Implementation;
using CoderAPI.Repository.Interface;
using CoderAPI.Repository.Interface.Problem;
using CoderAPI.Service.Interface.Problem;

namespace CoderAPI.Service.Implementation.Problem
{
    public class ProblemPlayGroundService : IProblemPlayGroundService
    {
        private readonly ICustomLogger _logger;
        private readonly IJudge0Service _judge0Service;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IUserProblemSessionRepository _problemSessionRepository;
        private readonly IProblemDetailRepository _problemDetailRepository;
        private readonly IUserSolutionRepository _userSolutionRepository;

        public ProblemPlayGroundService(ICustomLogger logger, IJudge0Service judge0Service, ITestCaseRepository testCaseRepository, IUserProblemSessionRepository problemSessionRepository, IProblemDetailRepository problemDetailRepository, IUserSolutionRepository userSolutionRepository)
        {
            _logger = logger;
            _judge0Service = judge0Service;
            _testCaseRepository = testCaseRepository;
            _problemSessionRepository = problemSessionRepository;
            _problemDetailRepository = problemDetailRepository;
            _userSolutionRepository = userSolutionRepository;
        }

        public Task<ProblemEventResponseEnvelop> AddEvents(ListDto<ProblemEvents> events, long userId)
        {
            throw new NotImplementedException();
        }

        public async Task<RunCodeApiResponse> RunCode(RunCodeRequest runCode, long userId)
        {
            try
            {
                var userSolution = new UserSolution
                {
                    UserId = userId,
                    ProblemId = runCode.ProblemId,
                    UserProblemSessionId = runCode.UserProblemSessionId,
                    UserSolutionCode = runCode.Code,
                    SelectedLanguage = runCode.Language,
                    StatusDescription = RunCodeStatus.Pending.ToString(),
                    Result = RunCodeStatus.Pending.ToString(),
                    SubmissionDate = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                    IsSubmit = runCode.IsSubmit,
                };
                userSolution.UserSolutionId = await _userSolutionRepository.AddUserSolution(userSolution);

                var testCases = await _testCaseRepository.GetTestcasesByProblem(runCode.ProblemId, runCode.IsSubmit);

                runCode.Code = (await _problemDetailRepository.GetHiddenCode(runCode.ProblemId, runCode.Language)).Value + "\n" + runCode.Code;
                
                var testCaseResult = new List<UserTestCaseResult>();
                var testCaseResultdto = new List<TestCaseResultDto>();
                foreach (var testCase in testCases)
                {
                    var response = await _judge0Service.RunCode(new  DTOs.codeRunner.Judge0CodeRunRequest
                    {
                        ExpectedOutput = testCase.ExpectedOutput,
                        Input = testCase.TestCaseDetail,
                        Language = runCode.Language,
                        SourceCode = runCode.Code,
                    });

                    testCaseResult.Add(new UserTestCaseResult
                    {
                        TestCaseId = testCase.TestCaseId,
                        UserSolutionId = userSolution.UserSolutionId,
                        Status = response.Status,
                        Stdout = response.Stdout,
                        Stderr = response.Stderr,
                        CompileOutput = response.CompileOutput,
                        ExecutionTime = response.Time,
                        MemoryUsed = response.Memory,
                        CreatedBy = userId,
                        CreatedOn = DateTime.UtcNow,
                    });
                    //if(!runCode.IsSubmit)
                    testCaseResultdto.Add(new TestCaseResultDto
                    {
                        TestCaseId = testCase.TestCaseId,
                        Input = testCase.TestCaseDetail,
                        ExpectedOutput = testCase.ExpectedOutput,
                        ActualOutput = response.Stdout,
                        Status = response.Status,
                        ExecutionTime = response.Time,
                        MemoryUsed = response.Memory,
                        Stderr = response.Stderr,
                        CompileOutput = response.CompileOutput,
                    });
                    if(runCode.IsSubmit && response.Stderr != null && response.Stderr != "")
                    {
                        // If submission and one of the test case fails, break the loop
                        break;
                    }
                }
                var ok = await _testCaseRepository.AddUserTestCaseResults(testCaseResult);
                var updates = await _userSolutionRepository.MarkUserSolutionCompleted(userSolution.UserSolutionId);
                if (ok)
                {
                    if(updates.finalStatus == TestCasesStatus.Accepted)
                    {
                        return new RunCodeApiResponse
                        {
                            Status = true,
                            Message = "Run Code Successful",
                            Result = updates.finalStatus,
                            TestCaseResults = updates.IsSubmit ? null : testCaseResultdto,
                        };
                    }
                    return new RunCodeApiResponse
                    {
                        Status = true,
                        Message = "Run Code Successful",
                        Result = updates.finalStatus,
                        TestCaseResults = testCaseResultdto,
                    };
                }
                return new RunCodeApiResponse
                {
                    Status = false,
                    Message = "Failed to store test case results",
                    Result = RunCodeStatus.Error.ToString(),
                    TestCaseResults = null,
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "Error in ProblemPlayGroundService.RunCode");
                throw;
            }
        }

        public Task<ProblemEventResponseEnvelop> SendChat(LLMAnalysisRequest request, long userId)
        {
            throw new NotImplementedException();
        }

        private bool checkIfAllTestCasesAreValid(List<TestCaseDto> testCases)
        {
            foreach(var testCase in testCases)
            {
                if(string.IsNullOrEmpty(testCase.Input) || string.IsNullOrEmpty(testCase.ExpectedOutput))
                {
                    return false;
                }
            }
            return true;
        }
    }
}
