using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.TestCase;
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

        public async Task<List<TestCaseDto>> GetEdgeCasesByProblemId(long ProblemId)
        {
            try
            {
                var response = await _context.TestCases
                    .Where(tc => tc.ProblemId == ProblemId && tc.IsEdgeCase==true)
                    .Select(tc => new TestCaseDto
                    {
                        TestCaseId = tc.TestCaseId,
                        Input = tc.TestCaseDetail,
                        ExpectedOutput = tc.ExpectedOutput,
                        Explaination = ""
                    })
                    .ToListAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get edge cases by problemId: {ProblemId}.", ex);
                throw;
            }
        }

        public async Task<ProblemDto> GetProblemById(long ProblemId)
        {
            try
            {
                var problem = await _context.Problems.FindAsync(ProblemId);
                if (problem == null) return new ProblemDto();
                var response =  new ProblemDto
                {
                    ProblemId = problem.ProblemId,
                    ProblemName = problem.ProblemName,
                    Constraints = problem.Constraints ?? "",
                    ProblemDetail = problem.ProblemDetail,
                    DifficultyLevel = problem.DifficultyLevel,
                    Tags = _context.ProblemTags
                        .Where(pt => pt.ProblemId == ProblemId)
                        .Select(pt => new TagString
                        {
                            TagId = pt.TagId,
                            Value = pt.Tag.TagName
                        }).ToList(),
                    TestCases = _context.TestCases
                        .Where(tc => tc.IsHidden == false && tc.ProblemId == ProblemId)
                        .Select(tc => new TestCaseDto
                        {
                            TestCaseId = tc.TestCaseId,
                            Input = tc.TestCaseDetail,
                            ExpectedOutput = tc.ExpectedOutput,
                            Explaination = ""
                        })
                        .ToList()
                };
                return response;
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
                //var result = await (from p in _context.Problems
                //                    join us in _context.UserSolutions
                //                        on p.ProblemId equals us.ProblemId into usGrp
                //                    from us in usGrp.DefaultIfEmpty()
                //                    where (us == null || us.UserId == userId)
                //                          && (query.Tags == null || p.ProblemTags.Any(pt => query.Tags.Contains(pt.TagId)))
                //                          && (query.Difficulty == "All" || p.DifficultyLevel == query.Difficulty)
                //                    select new
                //                    {
                //                        Problem = p,
                //                        UserSolution = us,
                //                        Tags = p.ProblemTags.Select(pt => pt.Tag.TagName).ToList()
                //                    })
                //    .GroupBy(x => x.Problem)
                //    .Select(g => new ProblemCard
                //    {
                //        ProblemId = g.Key.ProblemId,
                //        ProblemName = g.Key.ProblemName,
                //        Tags = g.First().Tags, // safe because Tags are same for all in group
                //        UserStatus = g.Any(x => x.UserSolution != null && x.UserSolution.Result == ProblemStatus.Accepted.ToString())
                //            ? ProblemStatus.Accepted.ToString()
                //            : g.Where(x => x.UserSolution != null)
                //               .OrderByDescending(x => x.UserSolution.SubmissionDate)
                //               .Select(x => x.UserSolution.Result)
                //               .FirstOrDefault() ?? ProblemStatus.NotAttempted.ToString()
                //    })
                //    .AsNoTracking()
                //    .Skip((pageNumber - 1) * pageSize)
                //    .Take(pageSize)
                //    .ToListAsync();

                var result = await (from p in _context.Problems
                                    where p.IsActive
                                    select new ProblemCard
                                    {
                                        ProblemId = p.ProblemId,
                                        ProblemName = p.ProblemName,
                                        URL = "",
                                        Tags = _context.ProblemTags
                                            .Where(pt => pt.ProblemId == p.ProblemId)
                                            .Select(pt => pt.Tag.TagName)
                                            .ToList(),
                                        UserStatus = _context.UserSolutions
                                            .Where(us => us.ProblemId == p.ProblemId)
                                            .Select(us => us.Result)
                                            .FirstOrDefault() ?? ProblemStatus.NotAttempted.ToString()
                                    })
                                    .AsNoTracking()
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
