using CoderAPI.Helper.Interface;
using CoderAPI.Messages;
using CoderAPI.DTOs.LLM;
using System.Text.Json;
using CoderAPI.DTOs.User;

namespace CoderAPI.Helper.Implementation
{
    public class GeminiHelper : IGeminiHelper
    {
        public GeminiProblemChatResponse ExtractGeminiJson(string rawResponse)
        {
            var wrapper = JsonSerializer.Deserialize<GeminiWrapper>(rawResponse,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (wrapper?.Candidates == null || wrapper.Candidates.Count == 0)
                throw new Exception("No candidates returned by Gemini.");

            // Step 2: Extract candidate text
            var innerText = wrapper.Candidates[0].Content.Parts[0].Text;

            if (string.IsNullOrWhiteSpace(innerText))
                throw new Exception("Gemini response did not contain any text content.");

            // Step 3: Strip Markdown fences (```json ... ```)
            if (innerText.StartsWith("```"))
            {
                innerText = innerText.Trim();
                innerText = innerText.Replace("```json", "").Replace("```", "").Trim();
            }

            // Step 4: Deserialize the clean JSON into GeminiResponse
            var response = JsonSerializer.Deserialize<GeminiProblemChatResponse>(innerText,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (response == null)
                throw new Exception("Unable to deserialize Gemini JSON content.");

            return response;
        }

        public UserOnboardChatResponse ExtractOnboardMessage(string rawResponse)
        {
            var wrapper = JsonSerializer.Deserialize<GeminiWrapper>(rawResponse,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (wrapper?.Candidates == null || wrapper.Candidates.Count == 0)
                throw new Exception("No candidates returned by Gemini.");

            // Step 2: Extract candidate text
            var innerText = wrapper.Candidates[0].Content.Parts[0].Text;

            if (string.IsNullOrWhiteSpace(innerText))
                throw new Exception("Gemini response did not contain any text content.");

            // Step 3: Strip Markdown fences (```json ... ```)
            if (innerText.StartsWith("```"))
            {
                innerText = innerText.Trim();
                innerText = innerText.Replace("```json", "").Replace("```", "").Trim();
            }

            // Step 4: Deserialize the clean JSON into GeminiResponse
            var response = JsonSerializer.Deserialize<UserOnboardChatResponse>(innerText,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (response == null)
                throw new Exception("Unable to deserialize Gemini JSON content.");

            return response;
        }
    }
}
