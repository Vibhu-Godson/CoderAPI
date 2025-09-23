using System.Text.Json.Serialization;

namespace CoderAPI.Messages
{
    public class LLMAnalysisRequest
    {
        public long ProblemId { get; set; }
        public long UserProblemSessionId { get; set; }
        public string UserText { get; set; }
    }
    public class LLMResponse
    {
        public string Message { get; set; }
        public double Accuracy { get; set; }
        public string ExplainationOfScores { get; set; }

    }

    public class GeminiResponse
    {
        [JsonPropertyName("verbal_reply")]
        public string VerbalReply { get; set; }

        [JsonPropertyName("scores")]
        public Score Scores { get; set; }

        [JsonPropertyName("explaination_of_approach")]
        public string ExplainationOfApproach { get; set; }
    }

    public class Score
    {
        [JsonPropertyName("correctness")]
        public double Correctness { get; set; }

        [JsonPropertyName("completeness")]
        public double Completeness { get; set; }

        [JsonPropertyName("clarity")]
        public double Clarity { get; set; }

        [JsonPropertyName("alignment")]
        public double Alignment { get; set; }
    }
}
