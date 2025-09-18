using CoderAPI.Service.Interface;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.DTOs;

namespace CoderAPI.Service.Implementation
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly ICustomLogger _logger;

        public ProblemService(IProblemRepository problemRepository, ICustomLogger logger)
        {
            _problemRepository = problemRepository;
            _logger = logger;
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
    }
}
