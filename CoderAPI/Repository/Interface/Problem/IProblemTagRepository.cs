using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IProblemTagRepository
    {
        Task<List<TagDto>> GetAllTags();
        Task<List<ProblemCard>> GetProblemsByTagId(long tagId, long userId);
    }
}
