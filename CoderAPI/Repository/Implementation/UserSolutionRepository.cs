using CoderAPI.DBOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;

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

        public Task<string> MarkUserSolutionCompleted(long userSolutionId)
        {
            return Task.FromResult("Accepted");
        }
    }
}
