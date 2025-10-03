using CoderAPI.DBOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class UserSolutionRepository : IUserSolutionRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public UserSolutionRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<long> AddUserSolution(UserSolution solution)
        {
            try
            {
                await _context.UserSolutions.AddAsync(solution);
                await _context.SaveChangesAsync();
                return solution.UserSolutionId;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to add user solution", ex);
                throw;
            }
        }

        public async Task<string> GetCodeByUserSolutionId(long userSolutionId)
        {
            try
            {
                var userSolution = await _context.UserSolutions
                    .FindAsync(userSolutionId);
                return userSolution.UserSolutionCode;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get code by user solution Id: {userSolutionId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<(bool,string)> MarkUserSolutionCompleted(long userSolutionId)
        {
            try
            {
                var userTestCases = await _context.UserTestCaseResults
                    .Where(utc => utc.UserSolutionId == userSolutionId)
                    .ToListAsync();

                string finalStatus = "Unknown";

                // case 1: compile time or runtime error
                if (userTestCases.Any(utc => utc.Status == TestCasesStatus.CompilationError))
                    finalStatus = TestCasesStatus.CompilationError;

                else if (userTestCases.Any(utc => utc.Status == TestCasesStatus.RuntimeError))
                    finalStatus = TestCasesStatus.RuntimeError;

                // case 2: Wrong Answer
                else if (userTestCases.Any(utc => utc.Status == TestCasesStatus.WrongAnswer))
                    finalStatus = TestCasesStatus.WrongAnswer;

                else if (userTestCases.All(utc => utc.Status == TestCasesStatus.Accepted))
                    finalStatus = TestCasesStatus.Accepted;

                var totalTestCases = userTestCases.Count();
                var userSolution = await _context.UserSolutions.FindAsync(userSolutionId);

                userSolution.Result = finalStatus;
                userSolution.Accuracy = userTestCases.Count(utc => utc.Status == TestCasesStatus.Accepted) / totalTestCases;
                userSolution.ExecutionTime = userTestCases.Sum(utc => utc.ExecutionTime) / totalTestCases;
                userSolution.MemoryUsed = userTestCases.Sum(utc => utc.MemoryUsed) / totalTestCases;

                await _context.SaveChangesAsync();

                return (userSolution.IsSubmit, finalStatus);
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"unable to mark user solution completed for user solution id: {userSolutionId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
