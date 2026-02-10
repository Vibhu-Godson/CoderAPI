using CoderAPI.DTOs;
using CoderAPI.DTOs.ProblemSession;
using CoderAPI.Messages;

namespace CoderAPI.Service.Interface.Problem
{
    public interface IProblemPlayGroundService
    {
        Task<ProblemEventResponseEnvelop> AddEvents(ListDto<ProblemEvents> events, long userId);
        Task<RunCodeApiResponse> RunCode(RunCodeRequest runCode, long userId);
        Task<ProblemEventResponseEnvelop> SendChat(LLMAnalysisRequest request, long userId);
    }
}
