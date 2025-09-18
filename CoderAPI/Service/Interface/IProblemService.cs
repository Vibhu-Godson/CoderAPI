using CoderAPI.DTOs;

namespace CoderAPI.Service.Interface
{
    public interface IProblemService 
    {
        Task<ListPageDto<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId);
        Task<ProblemDto> GetProblemById(long problemId);
    }
}
