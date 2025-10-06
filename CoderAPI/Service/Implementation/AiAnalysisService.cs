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
        private readonly IUserSolutionRepository _userSolutionRepository;
        private readonly IGeminiLLM _geminiLLM;
        private readonly ICustomLogger _logger;
        private readonly IGeminiHelper _geminiHelper;

        public AiAnalysisService(IProblemRepository problemRepository, ICustomLogger logger, IGeminiLLM geminiLLM, IGeminiHelper geminiHelper, IUserSessionChatRepository userSessionChatRepository, IUserSolutionRepository userSolutionRepository)
        {
            _problemRepository = problemRepository;
            _logger = logger;
            _geminiLLM = geminiLLM;
            _geminiHelper = geminiHelper;
            _userSessionChatRepository = userSessionChatRepository;
            _userSolutionRepository = userSolutionRepository;
        }

        public async Task<LLMResponse> AiChat(LLMAnalysisRequest request)
        {
            try
            {
                var problem = await _problemRepository.GetProblemById(request.ProblemId);
                var edgeCases = await _problemRepository.GetEdgeCasesByProblemId(request.ProblemId);
                var previousChat = await _userSessionChatRepository.GetSessionChat(request.UserProblemSessionId);
                string prompt;
                if (request.IsAfterSubmit)
                {
                    var userSolution = await _userSolutionRepository.GetCodeByUserSolutionId(request.UserSolutionId);
                    prompt = $@"
SYSTEM:
You are an interviewer on 'Chat' who is verifying whether the student truly understands their submitted solution. 
The submitted code has already been judged as correct — your role is ONLY to check the user's explanation against the code.  
you can also see your previos chat with this user for this question 
Your responsibilities:
1. Ensure the user can explain everything they wrote in the code (logic, data structures, edge cases).
2. Verify that the explanation actually matches the submitted code (not a different approach).
3. If the explanation is incomplete, vague, or mismatched with the code — ask 1–3 probing questions to dig deeper (like a real interviewer would).
4. Ask specific, interview-style follow-ups about particular parts of the solution (e.g., *""Why did you choose this data structure?""* or *""How does your code handle edge case X?""*).
5. Encourage the student with short, constructive feedback — do NOT give direct solutions.

Inputs:
- problem_name: {problem.ProblemName}
- problem_text: {problem?.ProblemDetail}
- submitted_code: {userSolution}
Previous Chat:
AI: What is your approach to solve this problem
{string.Join("\n", previousChat.Where(ch => !ch.IsAfterSubmit).Select(ch => $"User: {ch.ChatMessage} \nAI: {ch.AiReply}"))}
User: Code submitted
AI: please explain your approach properly 
{string.Join("\n", previousChat.Where(ch => ch.IsAfterSubmit).Select(ch => $"User: {ch.ChatMessage} \nAI: {ch.AiReply}"))}
- user_explanation: {request.UserText}

Output strictly in JSON with the following format:
{{
  ""verbal_reply"": ""<a short coaching reply, encouraging tone, with clarifying or probing questions if needed>"",
  ""scores"": {{
    ""correctness"": 0.00-1.00,    // does the explanation match the actual code
    ""completeness"": 0.00-1.00,   // how fully the user explained their approach
    ""clarity"": 0.00-1.00,        // how clearly they expressed their reasoning
    ""alignment"": 0.00-1.00       // explanation alignment with submitted code
  }},
  ""summary_of_explanation"": ""<one-line summary of how well the user explained their approach>""
}}
Note: if you get average of correctness, clarity, completeness and alignment > 0.80 then make your reply as a closing statement. you can defenately ask more question if it is required
but you must appreciate and say that the question is completed now for you see you in next question 'Happy Coding..!'
";
                }
                else
                {

                    prompt = $@"
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

                }
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
                    IsAfterSubmit = request.IsAfterSubmit
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

        public async Task<bool> CanChat(long userId)
        {
            try
            {
                return await _userSessionChatRepository.CanChat(userId);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, $"ServerError: unable to check can chat for userId: {userId}", ex);
                throw;
            }
        }
    }
}
