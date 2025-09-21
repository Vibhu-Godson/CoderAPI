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

    }
}
