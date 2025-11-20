using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.TestCase;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Problem
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
                    IsLocked = problem.IsLocked ?? false,
                    Hints = problem.Hints != null ? problem.Hints.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
                    AdditionalDetails = problem.AdditionalDetails != null ? problem.AdditionalDetails.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
                    AnalyticDetails = problem.AnalyticDetails != null ? problem.AnalyticDetails.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
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

        public async Task<ListPageDto<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId)
        {
            try
            {
                IQueryable<long> problemIdQuery = _context.Problems
                    .Where(p => p.IsActive)
                    .Select(p => p.ProblemId);


                if(query.Tags != null && query.Tags.Count > 0)
                {
                    problemIdQuery = from pt in _context.ProblemTags
                                     where query.Tags.Contains(pt.TagId)
                                     select pt.ProblemId;
                    problemIdQuery = problemIdQuery.Distinct();
                }

                if(!string.IsNullOrEmpty(query.Difficulty) && query.Difficulty != "All")
                {
                    problemIdQuery = from pid in problemIdQuery
                                     join p in _context.Problems on pid equals p.ProblemId
                                     where p.DifficultyLevel == query.Difficulty
                                     select pid;
                }
                var filteredProblemIds = await problemIdQuery
                            .Distinct()
                            .ToListAsync();

                var pagedIds = filteredProblemIds
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var response = await (
                            from p in _context.Problems
                            where pagedIds.Contains(p.ProblemId)
                            select new ProblemCard
                            {
                                ProblemId = p.ProblemId,
                                ProblemName = p.ProblemName,
                                URL = "",
                                DifficultyLevel = p.DifficultyLevel,
                                IsLocked = p.IsLocked ?? false,

                                Tags = _context.ProblemTags
                                            .Where(pt => pt.ProblemId == p.ProblemId)
                                            .Select(pt => pt.Tag.TagName)
                                            .ToList(),

                                UserStatus =
                                    (
                                        _context.UserProblemSessions
                                            .Where(us => us.ProblemId == p.ProblemId && us.UserId == userId)
                                            .Select(us => us.SessionStatus)
                                            .FirstOrDefault()
                                        == ProblemStatus.Completed.ToString()
                                    )
                                    ? ProblemStatus.Completed.ToString()
                                    :
                                    (
                                        _context.UserSolutions
                                            .Where(us => us.UserId == userId &&
                                                         us.ProblemId == p.ProblemId &&
                                                         us.IsSubmit)
                                            .Select(us => us.Result)
                                            .FirstOrDefault()
                                        ?? ProblemStatus.NotAttempted.ToString()
                                    ),

                                Acceptance =
                                    !_context.UserSolutions.Any(us => us.ProblemId == p.ProblemId)
                                        ? 0
                                        : Math.Round(
                                            ((decimal)_context.UserSolutions
                                                .Count(us => us.ProblemId == p.ProblemId &&
                                                             us.Result == ProblemStatus.Accepted.ToString())
                                          /
                                            (decimal)_context.UserSolutions
                                                .Count(us => us.ProblemId == p.ProblemId))
                                          *100,2)
                            }
                        ).AsNoTracking().ToListAsync();


                return new ListPageDto<ProblemCard>
                {
                    Items = response,
                    TotalCount = filteredProblemIds.Count,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(filteredProblemIds.Count / (double)pageSize)
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get problems for user {userId}", ex);
                throw;
            }
        }
    }
}
