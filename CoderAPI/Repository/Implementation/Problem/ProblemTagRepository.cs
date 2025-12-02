using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Enum;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Problem
{
    public class ProblemTagRepository : IProblemTagRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public ProblemTagRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<TagDto>> GetAllTags()
        {
            try
            {
                var tags = await _context.Tags
                    .Select(t => new TagDto
                    {
                        TagId = t.TagId,
                        TagName = t.TagName,
                        TotalQuestions = t.ProblemTags.Count()
                    })
                    .ToListAsync();
                return tags;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to get all tags \n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<List<ProblemCard>> GetProblemsByTagId(long tagId, long userId)
        {
            try
            {
                var problems = await (from p in _context.Problems
                      where p.IsActive && p.ProblemTags.Any(pt => pt.TagId == tagId)
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
                          UserStatus = (_context.UserProblemSessions
                              .Where(us => us.ProblemId == p.ProblemId && us.UserId == userId)
                              .Select(us => us.SessionStatus)
                              .FirstOrDefault() == ProblemStatus.Completed.ToString()) ?
                              ProblemStatus.Completed.ToString() :
                              (_context.UserSolutions
                                  .Where(us => us.UserId == userId && us.ProblemId == p.ProblemId && us.IsSubmit)
                                  .Select(us => us.Result)
                                  .FirstOrDefault()
                              ??
                              ProblemStatus.NotAttempted.ToString()),
                          Acceptance = _context.UserSolutions
                          .Count(us => us.ProblemId == p.ProblemId) == 0 ? (decimal)0.0 :
                          ((_context.UserSolutions
                          .Count(us => us.ProblemId == p.ProblemId && us.Result == ProblemStatus.Accepted.ToString()))
                          /
                          (_context.UserSolutions
                          .Count(us => us.ProblemId == p.ProblemId)))
                      })
                                    .AsNoTracking()
                                    .ToListAsync();
                return problems;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"Unable to get problems by tag id: {tagId} \n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }
    }
}
