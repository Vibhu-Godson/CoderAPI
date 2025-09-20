using CoderAPI.Service.Interface;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.DTOs;
using CoderAPI.Messages;
using CoderAPI.DBOs;
using CoderAPI.Enum;
using MassTransit;
using CoderAPI.DTOs.codeRunner;
using Microsoft.AspNetCore.SignalR;
using CoderAPI.Hubs;

namespace CoderAPI.Service.Implementation
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly IUserSolutionRepository _userSolutionRepository;
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IBus _bus;
        private readonly IHubContext<CodeExecutionHub> _hubContext;
        private readonly ICustomLogger _logger;

        public ProblemService(IProblemRepository problemRepository, IUserSolutionRepository userSolutionRepository, ITestCaseRepository testCaseRepository, ICustomLogger logger, IBus bus, IHubContext<CodeExecutionHub> hubContext)
        {
            _problemRepository = problemRepository;
            _userSolutionRepository = userSolutionRepository;
            _testCaseRepository = testCaseRepository;
            _bus = bus;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task<ProblemDto> GetProblemById(long problemId)
        {
            try
            {
                var response = await _problemRepository.GetProblemById(problemId);
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
                return new ListPageDto<ProblemCard>
                {
                    Items = response,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error,$"ServerError: unable to get all problems", ex);
                throw;
            }
        }

        public async Task<StatusResponse> RunCode(RunCodeRequest request, long userId)
        {
            try
            {
                // Adding user's colution into db 
                var userSolution = new UserSolution
                {
                    UserId = userId,
                    ProblemId = request.ProblemId,
                    UserProblemSessionId = request.UserProblemSessionId,
                    UserSolutionCode = request.Code,
                    SelectedLanguage = request.Language,
                    StatusDescription = RunCodeStatus.Pending.ToString(),
                    SubmissionDate = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                };
                userSolution.UserSolutionId = await _userSolutionRepository.AddUserSolution(userSolution);



                // Getting all test cases for the problem and publishing to the bus
                var testCases = await _testCaseRepository.GetTestcasesByProblem(request.ProblemId, request.IsSubmit);
                
                await _hubContext.Groups.AddToGroupAsync(userId.ToString(), userSolution.UserSolutionId.ToString());


                foreach (var tc in testCases)
                {
                    //aded user test case result with pending status in db 
                    var userTestCaseResult = new UserTestCaseResult
                    {
                        UserSolutionId = userSolution.UserSolutionId,
                        TestCaseId = tc.TestCaseId,
                        Status = RunCodeStatus.Pending.ToString(),
                        CreatedBy = userId,
                        CreatedOn = DateTime.UtcNow,
                    };
                    await _testCaseRepository.AddUserTestCaseResult(userTestCaseResult);

                    // adding testcases into queue for independent execution 
                    var judgeRequest = new Judge0CodeRunRequest
                    {
                        SourceCode = request.Code,
                        Language = request.Language,
                        Input = tc.TestCaseDetail,
                        ExpectedOutput = tc.ExpectedOutput,
                        UserSolutionId = userSolution.UserSolutionId,
                        TestCaseId = tc.TestCaseId,
                    };
                    
                    await _bus.Publish(judgeRequest);
                }
                return new StatusResponse { Message = "Code is being processed", Status = true };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServerError: unable to run code", ex);
                return new StatusResponse
                {
                    Message = "Failed to process the code",
                    Status = false
                };
            }
        }
    }
}
