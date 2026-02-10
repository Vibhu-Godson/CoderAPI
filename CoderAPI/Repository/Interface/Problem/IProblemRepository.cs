using CoderAPI.DTOs;
using CoderAPI.DTOs.TestCase;

namespace CoderAPI.Repository.Interface.Problem
{
    public interface IProblemRepository
    {
        Task<ListPageDto<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId);
        Task<ProblemDto> GetProblemById(long ProblemId, long userId);
        Task<List<TestCaseDto>> GetEdgeCasesByProblemId(long ProblemId);
    }
}
