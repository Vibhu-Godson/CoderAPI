using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemDiscussion;

namespace CoderAPI.Service.Interface.Problem
{
    public interface IProblemDiscussionService
    {
        Task<StatusResponse> AddDiscussion(AddProblemDiscussionModel problemDiscussion, long userId);
        Task<StatusResponse> UpdateDiscussion(AddProblemDiscussionModel problemDiscussion, long ProblemDiscussionId, long userId);
        Task<ListPageDto<ProblemDiscussionCardView>> GetAllDiscussions(long ProblemId, int pageNumber, int pageSize);
        Task<ProblemDiscussionDto> GetProblemDiscussion(long ProblemDiscussionId);
    }
}
