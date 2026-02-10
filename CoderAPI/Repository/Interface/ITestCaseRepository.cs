using CoderAPI.DBOs;

namespace CoderAPI.Repository.Interface
{
    public interface ITestCaseRepository
    {
        Task<List<TestCase>> GetTestcasesByProblem(long ProblemId, bool IsSubmit);
        Task<long> AddUserTestCaseResult(UserTestCaseResult result);
        Task<bool> AddUserTestCaseResults(List<UserTestCaseResult> results);
        Task<(long, int)> UpdateUserTestCaseResult(long userSolutionId, long TestCaseId, string status, string stdout, string stderr, string compileOutput, double? ExecutionTime, long? MemoryUsed);
    }
}
