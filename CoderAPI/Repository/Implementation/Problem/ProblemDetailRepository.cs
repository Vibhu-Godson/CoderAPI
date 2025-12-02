using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.Repository.Implementation.Problem
{
    public class ProblemDetailRepository : IProblemDetailRepository
    {
        private readonly CodeDbContext _context;
        private readonly ICustomLogger _logger;

        public ProblemDetailRepository(CodeDbContext context, ICustomLogger logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CustomString> GetHiddenCode(long ProblemId, string language)
        {
            try
            {
                var hiddenCode = await _context.ProblemDetails
                    .Where(pd => pd.ProblemId == ProblemId && pd.LanguageName == language)
                    .Select(pd => new CustomString
                    {
                        Value = pd.HiddenCode ?? ""
                    })
                    .FirstOrDefaultAsync();

                return hiddenCode;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: unable to get Hidden code for ProblemId:{ProblemId}, Language: {language}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<List<Language>> GetLanguagesByProblemId(long ProblemId)
        {
            try
            {
                var response = await _context.ProblemDetails
                    .Where(pd => pd.ProblemId == ProblemId)
                    .Select(pd => new Language
                    {
                        Value = pd.LanguageName,
                        ProblemDetailId = pd.ProblemDetailId
                    })
                    .ToListAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: Unable to get Languages for ProblemId: {ProblemId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<CustomString> GetStarterCodeByProblemDetailId(long ProblemDetailId)
        {
            try
            {
                var response = await _context.ProblemDetails
                    .Where(pd => pd.ProblemDetailId == ProblemDetailId)
                    .Select(pd => new CustomString
                    {
                        Value = pd.StarterCode ?? ""
                    })
                    .FirstOrDefaultAsync();
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"DbError: Unable to get StarterCode for ProblemDetailId: {ProblemDetailId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
