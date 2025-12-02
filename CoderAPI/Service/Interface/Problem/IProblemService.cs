using CoderAPI.DTOs;
using CoderAPI.Messages;

namespace CoderAPI.Service.Interface.Problem
{
    public interface IProblemService 
    {
        Task<ListPageDto<ProblemCard>> GetProblems(ProblemQuery query, int pageNumber, int pageSize, long userId);
        Task<ProblemDto> GetProblemById(long problemId);
        Task<RunCodeResponse> RunCode(RunCodeRequest request, long userId);
        Task<CreateUserSessionResponse> StartNewUserProblemSession(long ProblemId, long userId);
        Task<StatusResponse> MarkUserSessionComplete(long UserSessionId, long userId);
    }
}
