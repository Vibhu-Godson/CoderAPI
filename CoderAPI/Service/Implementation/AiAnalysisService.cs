using CoderAPI.DBOs;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.MicroService.LLM.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Service.Interface;
using System.Text.Json;

namespace CoderAPI.Service.Implementation
{
    public class AiAnalysisService : IAiAnalysisService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly IUserSessionChatRepository _userSessionChatRepository;
        private readonly IGeminiLLM _geminiLLM;
        private readonly ICustomLogger _logger;
        private readonly IGeminiHelper _geminiHelper;

        public AiAnalysisService(IProblemRepository problemRepository, ICustomLogger logger, IGeminiLLM geminiLLM, IGeminiHelper geminiHelper, IUserSessionChatRepository userSessionChatRepository)
        {
            _problemRepository = problemRepository;
            _logger = logger;
            _geminiLLM = geminiLLM;
            _geminiHelper = geminiHelper;
            _userSessionChatRepository = userSessionChatRepository;
        }

        public async Task<LLMResponse> AiChat(LLMAnalysisRequest request)
        {
            try
            {
                var problem = await _problemRepository.GetProblemById(request.ProblemId);
                var edgeCases = await _problemRepository.GetEdgeCasesByProblemId(request.ProblemId);
                var previousChat = await _userSessionChatRepository.GetSessionChat(request.UserProblemSessionId);
                var prompt = $@"
SYSTEM:
You are a supportive mentor and interviewer who is guiding a student in their coding journey. 
Your role is NOT to give direct answers or complete solutions. 
Instead:
- Encourage the student and appreciate their effort.
- Provide interview-style coaching by asking 1–2 guiding questions.
- If the student has doubts, clarify them indirectly with hints.
- Give short, motivational feedback to keep the student excited to learn.
- Use a friendly and constructive tone (like a mentor in a mock interview).

Note: dont give code snippets or direct solutions.
Inputs:
- problem_name: {problem.ProblemName}
- problem_text: {problem?.ProblemDetail}
- test_results: {string.Join("\n", edgeCases.Select(e => $"{e.Input} => {e.ExpectedOutput}"))}

Previous Chat:
AI: What is your approach to solve this problem
{string.Join("\n", previousChat.Select(ch => $"{ch.ChatMessage} => {ch.AiReply}"))}

- user_last_text: {request.UserText}

Output strictly in JSON with the following format:
{{
  ""verbal_reply"": ""<a short coaching message, 1-2 sentences>"",
  ""scores"": {{
    ""correctness"": 0.0-1.0,
    ""completeness"": 0.0-1.0,
    ""clarity"": 0.0-1.0,
    ""alignment"": 0.0-1.0
  }},
  ""explaination_of_approach"": ""<one-line summarization of user's approach>""
}}
";

                var rawResponse = await _geminiLLM.GetGeminiResponse(prompt);

                var response = _geminiHelper.ExtractGeminiJson(rawResponse);

                if (response == null)
                    return new LLMResponse
                    {
                        Message = "Error: Unable to process the response from LLM.",
                        Accuracy = 0.0,
                        ExplainationOfScores = ""
                    };

                double accuracy = (response.Scores.Correctness * 0.50)
                                + (response.Scores.Completeness * 0.20)
                                + (response.Scores.Clarity * 0.15)
                                + (response.Scores.Alignment * 0.15);


                var userSessionChat = new UserSessionChat
                {
                    ChatMessage = request.UserText,
                    AiResponse = JsonSerializer.Serialize(response),
                    AiReply = response.VerbalReply,
                    AiExplaination = response.ExplainationOfApproach,
                    Alignment = (decimal)response.Scores.Alignment,
                    Clarity = (decimal)response.Scores.Clarity,
                    Completeness = (decimal)response.Scores.Completeness,
                    Correctness = (decimal)response.Scores.Correctness,
                    Readiness = (decimal)accuracy,
                    SentOn = DateTime.UtcNow,
                    UserProblemSessionId = request.UserProblemSessionId,
                    CreatedBy = 1,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = true,
                };
                await _userSessionChatRepository.AddUserSessionChat(userSessionChat);

                return new LLMResponse
                {
                    Message = response.VerbalReply,
                    Accuracy = accuracy,
                    ExplainationOfScores = response.ExplainationOfApproach
                };

            }
            catch(Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to process AiChat request.", ex);
                throw;
            }
        }
    }
}
