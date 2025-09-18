using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public ProblemRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProblemDto> GetProblemById(long ProblemId)
        {
            try
            {
                var problem = await _context.Problems.FindAsync(ProblemId);
                if (problem == null) return new ProblemDto();
                return new ProblemDto
                {
                    ProblemId = problem.ProblemId,
                    ProblemName = problem.ProblemName,
                    Constraints = problem.Constraints ?? "",
                    ProblemDetail = problem.ProblemDetail,
                    DifficultyLevel = problem.DifficultyLevel,
                    Tags = problem.ProblemTopics.Select(pt => new TopicString
                    {
                        TopicId = pt.TopicId,
                        Value = pt.Topic.TopicName
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get problem by problemId: {ProblemId}.",ex);
                throw;
            }
        }

        public async Task<List<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId)
        {
            try
            {
                var result = await (from p in _context.Problems
                                    join us in _context.UserSolutions
                                        on p.ProblemId equals us.ProblemId into usGrp
                                    from us in usGrp.DefaultIfEmpty()
                                    where (us == null || us.UserId == userId)
                                          && (query.Tags == null || p.ProblemTopics.Any(pt => query.Tags.Contains(pt.TopicId)))
                                          && (query.Difficulty == "All" || p.DifficultyLevel == query.Difficulty)
                                    group us by p into g
                                    select new ProblemCard
                                    {
                                        ProblemId = g.Key.ProblemId,
                                        ProblemName = g.Key.ProblemName,
                                        Tags = g.Key.ProblemTopics.Select(pt => pt.Topic.TopicName).ToList(),
                                        UserStatus =
                                            g.Any(x => x != null && x.Result == ProblemStatus.Accepted.ToString())
                                                ? ProblemStatus.Accepted.ToString()
                                                : g.Where(x => x != null)
                                                   .OrderByDescending(x => x.SubmissionDate) 
                                                   .Select(x => x.Result)
                                                   .FirstOrDefault() ?? ProblemStatus.NotAttempted.ToString()
                                    })
                    .AsNoTracking()
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return result;

            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get problems for user {userId}", ex);
                throw;
            }
        }
    }
}
