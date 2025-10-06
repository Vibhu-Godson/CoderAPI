namespace CoderAPI.DTOs
{
    public class ProblemCard
    {
        public long ProblemId { get; set; }
        public string ProblemName { get; set; }
        public string URL { get; set; }
        public List<string> Tags { get; set; }
        public string UserStatus { get; set; }
        public bool IsLocked { get; set; }
    }
    public class ProblemQuery
    {
        public string Difficulty { get; set; } = "All"; // e.g., "Easy", "Medium", "Hard", "All"
        public List<long>? Tags { get; set; } // e.g., "Array", "String", "Dynamic Programming", "All"
        public string Status { get; set; } = "All"; // e.g., "Solved", "Unsolved", "All"
    }
}
