using CoderAPI.DTOs;
using CoderAPI.DTOs.Session;
using CoderAPI.DTOs.TestCase;
using CoderAPI.Messages;

namespace CoderAPI.Helper.Interface
{
    public interface IPromptSelector
    {
        string BuildPrompt(ProblemDto problem, LLMAnalysisRequest request, List<TestCaseDto>EdgeCases, List<UserSessionChatDto>sessionChat, string userSolution);

    }
}
