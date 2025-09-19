namespace CoderAPI.DTOs.codeRunner
{
    public class Judge0Result
    {
        public string SubmissionId { get; set; }
        public string Status { get; set; } // mapping to Accepted/WA/TLE/CompileError etc
        public string Stdout { get; set; }
        public string Stderr { get; set; }
        public string CompileOutput { get; set; }
        public double? ExecutionTime { get; set; }
        public long? MemoryUsed { get; set; }
        public int PassedTestCases { get; set; }
        public int TotalTestCases { get; set; }
    }
}
