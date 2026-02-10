namespace CoderAPI.DTOs.ProblemSession
{
    public class ProblemEventResponseEnvelop
    {
        public bool Status { get; set; }
        public List<TestCaseResultDto>? TestCaseResponses { get; set; }
        public string? BotReply { get; set; }
        public string? Message { get; set; }
        public bool IsSessionCompleted { get; set; }
    }
    public class RunCodeApiResponse : StatusResponse
    {
        public List<TestCaseResultDto>? TestCaseResults { get; set; }
        public string Result { get; set; }
    }
}
