namespace CoderAPI.DTOs
{
    public class StatusResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
    }

    public class ListDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
    public class ListPageDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
    public class CreateUserSessionResponse : StatusResponse
    {
        public long UserProblemSessionId { get; set; }
    }
    public class RunCodeResponse : StatusResponse
    {
        public long UserSolutionId { get; set; }
        public List<TestCaseResultDto> TestCaseResults { get; set; } = new();
    }

    public class TestCaseResultDto
    {
        public long UserTestCaseResultId { get; set; }
        public long TestCaseId { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public string ActualOutput { get; set; }
        public string Status { get; set; }
        public double? ExecutionTime { get; set; }
        public long? MemoryUsed { get; set; }
        public string Stderr { get; set; }
        public string CompileOutput { get; set; }
    }
}
