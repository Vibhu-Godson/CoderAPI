using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;

namespace CoderAPI.Service.Interface.Problem
{
    public interface IProblemTagService
    {
        Task<ListDto<TagDto>> GetAllTags();
        Task<ListDto<ProblemCard>> GetProblemsByTagId(long tagId, long userId);
    }
}
