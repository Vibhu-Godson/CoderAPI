using CoderAPI.Messages;

namespace CoderAPI.Helper.Interface
{
    public interface IGeminiHelper
    {
        GeminiResponse ExtractGeminiJson(string rawResponse);
    }
}
