using CoderAPI.DBOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CoderAPI.Repository.Implementation
{
    public class TestCaseRepository : ITestCaseRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public TestCaseRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddUserTestCaseResult(UserTestCaseResult result)
        {
            try
            {
                await _context.UserTestCaseResults.AddAsync(result);
                await _context.SaveChangesAsync();
                return result.UserTestCaseResultId;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user test case result", ex);
                throw;
            }
        }

        public Task<List<TestCase>> GetTestcasesByProblem(long ProblemId, bool IsSubmit)
        {
            try
            {
                var testcases = _context.TestCases
                    .Where(tc => tc.ProblemId == ProblemId && (IsSubmit ? true : tc.IsHidden == false))
                    .ToListAsync();
                return testcases;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get test cases by problem id: {ProblemId}", ex);
                throw;
            }
        }

        public async Task<(long, int)> UpdateUserTestCaseResult(long userSolutionId, long TestCaseId, string status, string stdout, string stderr, string compileOutput)
        {
            try
            {
                var userTestCase = await _context.UserTestCaseResults
                    .Where(utc => utc.UserSolutionId == userSolutionId && utc.TestCaseId == TestCaseId)
                    .FirstOrDefaultAsync();
                userTestCase.Status = status;
                userTestCase.Stdout = stdout;
                userTestCase.Stderr = stderr;
                userTestCase.CompileOutput = compileOutput;
                userTestCase.UpdatedOn = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return (userTestCase.UserTestCaseResultId, await TotalPendingTestCaseByUserSolution(userSolutionId));
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to update user test case result", ex);
                throw;
            }
        }

        private async Task<int> TotalPendingTestCaseByUserSolution(long UserSolutionId) =>
            await _context.UserTestCaseResults.CountAsync(utc => utc.Status == RunCodeStatus.Pending.ToString());
    }
}
