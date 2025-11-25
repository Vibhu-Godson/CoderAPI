using CoderAPI.DBOs;
using CoderAPI.DTOs.ProblemDiscussion;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IProblemDiscussionRepository
    {
        Task<long> AddProblemDiscussion(ProblemDiscussion problemDiscussion);
        Task<bool> UpdateProblemDiscussion(long ProblemDiscussionId, long userId);
        Task<bool> AddProblemDiscussionBlocks(List<ProblemDiscussionBlock> problemDiscussionBlocks);
        Task<bool> UpdateProblemDiscussionBlocks(long ProblemDiscussionId,List<ProblemDiscussionBlock> problemDiscussionBlocks);
        Task<bool> AddProblemDiscussionTags(List<ProblemDiscussionTag> problemDiscussionTags);
        Task<bool> UpdateProblemDiscussionTags(long ProblemDiscussionId, List<ProblemDiscussionTag> problemDiscussionTags);
        Task<bool> AddReaction(long ProblemDiscussionId, long UserId, string ReactionType);
        Task<bool> AddProblemDiscussionView(ProblemDiscussionView view);
        Task<(List<ProblemDiscussionCardView>, int)> GetProblemDiscussionCards(long ProblemId, int pageNumber, int pageSize);
        Task<ProblemDiscussionDto> GetProblemDiscussion(long ProblemDiscussionId);
    }
}
