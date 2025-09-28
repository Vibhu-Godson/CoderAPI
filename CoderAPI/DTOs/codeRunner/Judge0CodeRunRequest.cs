namespace CoderAPI.DTOs.codeRunner
{
    public class Judge0CodeRunRequest
    {
        public long UserSolutionId { get; set; }
        public long UserProblemSessionId { get; set; }
        public long TestCaseId { get; set; }
        public string SourceCode { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Input { get; set; } = string.Empty;
        public string ExpectedOutput { get; set; } = string.Empty;
    }
}
