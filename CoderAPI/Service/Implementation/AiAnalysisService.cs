using CoderAPI.DBOs;
using CoderAPI.DTOs;
using CoderAPI.DTOs.Session;
using CoderAPI.DTOs.TestCase;
using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.MicroService.LLM.Interface;
using CoderAPI.Repository.Interface;
using CoderAPI.Repository.Interface.Problem;
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
        private readonly IPromptSelector _promptSelector;

        public AiAnalysisService(IProblemRepository problemRepository, ICustomLogger logger, IGeminiLLM geminiLLM, IGeminiHelper geminiHelper, IUserSessionChatRepository userSessionChatRepository, IUserSolutionRepository userSolutionRepository, IPromptSelector promptSelector)
        {
            _problemRepository = problemRepository;
            _logger = logger;
            _geminiLLM = geminiLLM;
            _geminiHelper = geminiHelper;
            _userSessionChatRepository = userSessionChatRepository;
            _userSolutionRepository = userSolutionRepository;
            _promptSelector = promptSelector;
        }

        public async Task<LLMResponse> AiChat(LLMAnalysisRequest request)
        {
            try
            {
                var problem = await _problemRepository.GetProblemById(request.ProblemId, 0);
                var edgeCases = await _problemRepository.GetEdgeCasesByProblemId(request.ProblemId);
                var previousChat = await _userSessionChatRepository.GetSessionChat(request.UserProblemSessionId);
                var userSolution = request.UserSolutionId>0 ? await _userSolutionRepository.GetCodeByUserSolutionId(request.UserSolutionId): "";
                var prompt = _promptSelector.BuildCodingProblemPrompt(problem, request, edgeCases, previousChat, userSolution);

                var rawResponse = await _geminiLLM.GetGeminiResponse(prompt);
                var response = _geminiHelper.ExtractGeminiJson(rawResponse);

                if (response == null)
                {
                    return new LLMResponse
                    {
                        Message = "Error: Unable to process the response from LLM.",
                        Accuracy = 0.0,
                        ExplainationOfScores = ""
                    };
                }

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
                    IsAfterSubmit = request.IsAfterSubmit,
                    
                };
                await _userSessionChatRepository.AddUserSessionChat(userSessionChat);

                return new LLMResponse
                {
                    Message = response.VerbalReply,
                    Accuracy = accuracy,
                    ExplainationOfScores = response.ExplainationOfApproach
                };
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, "ServerError: unable to process AiChat request.", ex);
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
