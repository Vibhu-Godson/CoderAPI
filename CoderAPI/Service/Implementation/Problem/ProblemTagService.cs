using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using CoderAPI.Service.Interface.Problem;

namespace CoderAPI.Service.Implementation.Problem
{
    public class ProblemTagService : IProblemTagService
    {
        private readonly IProblemTagRepository _problemTagRepository;
        private readonly ICustomLogger _logger;
        public ProblemTagService(IProblemTagRepository problemTagRepository, ICustomLogger logger)
        {
            _problemTagRepository = problemTagRepository;
            _logger = logger;
        }
        public async Task<ListDto<TagDto>> GetAllTags()
        {
            try
            {
                var response = await _problemTagRepository.GetAllTags();
                return new ListDto<TagDto>
                {
                    Items = response,
                    TotalCount = response.Count
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get all tags\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }

        public async Task<ListDto<ProblemCard>> GetProblemsByTagId(long tagId, long userId)
        {
            try
            {
                
                var response = await _problemTagRepository.GetProblemsByTagId(tagId, userId);
                return new ListDto<ProblemCard>
                {
                    Items = response,
                    TotalCount = response.Count
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to get problems by tag id {tagId}\n{ex.Message}\n{ex.StackTrace}", ex);
                throw;
            }
        }
    }
}
