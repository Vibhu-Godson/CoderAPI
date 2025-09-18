using CoderAPI.DTOs;

namespace CoderAPI.Repository.Interface
{
    public interface IProblemRepository
    {
        Task<List<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId);
        Task<ProblemDto> GetProblemById(long ProblemId);
    }
}
