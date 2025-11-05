using CoderAPI.DTOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;

namespace CoderAPI.Service.Implementation
{
    public class ProblemDetailService : IProblemDetailService
    {
        private readonly IProblemDetailRepository _problemDetailRepository;
        private readonly ICustomLogger _logger;

        public ProblemDetailService(IProblemDetailRepository problemDetailRepository, ICustomLogger logger)
        {
            _problemDetailRepository = problemDetailRepository;
            _logger = logger;
        }

        public async Task<CustomString> GetCommonCodeByProblemDetail(long ProblemDetailId)
        {
            try
            {
                var response = await _problemDetailRepository.GetStarterCodeByProblemDetailId(ProblemDetailId);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: Unable to get CommonCode for ProblemDetailId: {ProblemDetailId}\n{ex.Message}", ex);
                throw;
            }
        }

        public async Task<ListDto<Language>> GetLanguagesByProblemId(long ProblemId)
        {
            try
            {
                var response = await _problemDetailRepository.GetLanguagesByProblemId(ProblemId);
                return new ListDto<Language> { Items = response, TotalCount = response.Count };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServiceError: Unable to get Languages for ProblemId: {ProblemId}\n{ex.Message}", ex);
                throw;
            }
        }
    }
}
