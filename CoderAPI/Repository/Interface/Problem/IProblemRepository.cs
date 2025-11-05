using CoderAPI.DTOs;
using CoderAPI.DTOs.TestCase;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IProblemRepository
    {
        Task<List<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId);
        Task<ProblemDto> GetProblemById(long ProblemId);
        Task<List<TestCaseDto>> GetEdgeCasesByProblemId(long ProblemId);
    }
}
