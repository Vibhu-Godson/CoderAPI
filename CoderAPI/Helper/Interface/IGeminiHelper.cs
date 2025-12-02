using CoderAPI.DTOs.User;
using CoderAPI.Messages;

namespace CoderAPI.Helper.Interface
{
    public interface IGeminiHelper
    {
        GeminiProblemChatResponse ExtractGeminiJson(string rawResponse);
        UserOnboardChatResponse ExtractOnboardMessage(string rawResponse);
    }
}
