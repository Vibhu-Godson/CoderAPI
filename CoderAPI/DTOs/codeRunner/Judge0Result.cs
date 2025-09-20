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
        public int ExitCode { get; set; }
        public long Time { get; set; }
        public long Memory { get; set; }
    }
    // Matches Judge0 API response
    public class Judge0ApiResponse
    {
        public string Stdout { get; set; }
        public string Stderr { get; set; }
        public string Compile_Output { get; set; }
        public int? Exit_Code { get; set; }
        public string Time { get; set; }
        public long? Memory { get; set; }
        public Judge0Status Status { get; set; }
        public string Token { get; set; }
    }

    public class Judge0Status
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }

}
