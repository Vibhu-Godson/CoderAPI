using CoderAPI.DTOs.TestCase;
using System.ComponentModel.DataAnnotations;

namespace CoderAPI.DTOs
{
    public class ProblemDto
    {
        public long ProblemId { get; set; }
        public string ProblemName { get; set; }
        public string ProblemDetail { get; set; }
        public string DifficultyLevel { get; set; }
        public string Constraints { get; set; }
        public bool IsLocked { get; set; }
        public List<TagString> Tags { get; set; }
        public List<TestCaseDto> TestCases { get; set; }
        public List<string> Hints { get; set; }
        public List<string> AdditionalDetails { get; set; }
        public List<string> AnalyticDetails { get; set; }
        public string UserStatus { get; set; }
        public long LastIncompleteSessionId { get; set; }
    }
}
