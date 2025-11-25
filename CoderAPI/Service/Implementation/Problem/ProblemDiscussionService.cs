using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemDiscussion;
using CoderAPI.Helper.Interface;
using CoderAPI.Repository.Interface.Problem;
using CoderAPI.Service.Interface.Problem;

namespace CoderAPI.Service.Implementation.Problem
{
    public class ProblemDiscussionService : IProblemDiscussionService
    {
        private readonly IProblemDiscussionRepository _problemDiscussionRepository;
        private readonly ICustomLogger _logger;

        public ProblemDiscussionService(IProblemDiscussionRepository problemDiscussionRepository, ICustomLogger logger)
        {
            _problemDiscussionRepository = problemDiscussionRepository;
            _logger = logger;
        }

        public async Task<StatusResponse> AddDiscussion(AddProblemDiscussionModel problemDiscussion, long userId)
        {
            try
            {
                var problemDiscussionDbo = new ProblemDiscussion
                {
                    ProblemId = problemDiscussion.ProblemId,
                    UserId = userId,
                    UserSolutionId = problemDiscussion.UserSolutionId>0 ? problemDiscussion.UserSolutionId : null,
                    UserProblemSessionId = problemDiscussion.UserProblemSessionId>0 ? problemDiscussion.UserProblemSessionId : null,
                    ParentDiscussionId = problemDiscussion.ParentDiscussionId > 0 ? problemDiscussion.ParentDiscussionId : null,
                    IsEdited=false,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId,
                    IsActive = true,
                };
                problemDiscussionDbo.ProblemDiscussionId = await _problemDiscussionRepository.AddProblemDiscussion(problemDiscussionDbo);
                var blocks = problemDiscussion.Blocks
                    .Select( b => new ProblemDiscussionBlock
                    {
                        ProblemDiscussionId = problemDiscussionDbo.ProblemDiscussionId,
                        BlockType = b.BlockType,
                        BigTextContent = b.Content.Length>1000 ? b.Content : null,
                        ShortTextContent = b.Content.Length<=1000 ? b.Content : null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = userId,
                        IsActive = true,
                        ImageUrl = b.ImageUrl,
                        SortOrder = b.SortOrder,
                        IsEdited = false,
                    })
                    .ToList();

                await _problemDiscussionRepository.AddProblemDiscussionBlocks(blocks);

                var tags = problemDiscussion.Tags
                    .Select( t => new ProblemDiscussionTag
                    {
                        ProblemDiscussionId = problemDiscussionDbo.ProblemDiscussionId,
                        TagName = t.TagName,
                        UserId = userId,
                    })
                    .ToList();

                await _problemDiscussionRepository.AddProblemDiscussionTags(tags);

                return new StatusResponse
                {
                    Status = true,
                    Message = "Discussion added successfully",
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to add Discussion by userId: {userId}", ex);
                throw;
            }
        }

        public async Task<ListPageDto<ProblemDiscussionCardView>> GetAllDiscussions(long ProblemId, int pageNumber, int pageSize)
        {
            try
            {
                var (response, totalcount) = await _problemDiscussionRepository.GetProblemDiscussionCards(ProblemId, pageNumber, pageSize);
                return new ListPageDto<ProblemDiscussionCardView>
                {
                    Items = response,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalcount,
                    TotalPages = (int)Math.Ceiling((double)totalcount / pageSize)
                };
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to get Discussions for ProblemId: {ProblemId}", ex);
                throw;
            }
        }

        public async Task<ProblemDiscussionDto> GetProblemDiscussion(long ProblemDiscussionId)
        {
            try
            {
                var response = await _problemDiscussionRepository.GetProblemDiscussion(ProblemDiscussionId);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to get Discussion for ProblemDiscussionId: {ProblemDiscussionId}", ex);
                throw;
            }
        }

        public async Task<StatusResponse> UpdateDiscussion(AddProblemDiscussionModel problemDiscussion, long ProblemDiscussionId, long userId)
        {
            try
            {
                await _problemDiscussionRepository.UpdateProblemDiscussion(ProblemDiscussionId, userId);
                var blocks = problemDiscussion.Blocks
                    .Select(b => new ProblemDiscussionBlock
                    {
                        ProblemDiscussionId = ProblemDiscussionId,
                        BlockType = b.BlockType,
                        BigTextContent = b.Content.Length > 1000 ? b.Content : null,
                        ShortTextContent = b.Content.Length <= 1000 ? b.Content : null,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = userId,
                        IsActive = true,
                        ImageUrl = b.ImageUrl,
                        SortOrder = b.SortOrder,
                        IsEdited = false,
                    })
                    .ToList();
                await _problemDiscussionRepository.UpdateProblemDiscussionBlocks(ProblemDiscussionId, blocks);
                var tags = problemDiscussion.Tags
                    .Select(t => new ProblemDiscussionTag
                    {
                        ProblemDiscussionId = ProblemDiscussionId,
                        TagName = t.TagName,
                        UserId = userId,
                    })
                    .ToList();
                await _problemDiscussionRepository.UpdateProblemDiscussionTags(ProblemDiscussionId, tags);
                return new StatusResponse
                {
                    Status = true,
                    Message = "Discussion updated successfully",
                };

            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: Unable to update Discussion for ProblemDiscussionId: {ProblemDiscussionId} by userId: {userId}", ex);
                throw;
            }
        }
    }
}
