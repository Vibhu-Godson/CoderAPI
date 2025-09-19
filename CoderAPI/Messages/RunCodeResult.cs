namespace CoderAPI.Messages
{
    public class RunCodeResult
    {
        public long UserSolutionId { get; set; }
        public string Satus { get; set; }
        public string Stdout { get; set; }
        public string Stderr { get; set; }
        public string ComplieOutput { get; set; }
        public double? ExcecutionTime { get; set; }
        public long? MemoryUsed { get; set; }
        public int PassedTestCases { get; set; }
        public int TotalTestCases { get; set; }
    }
}
