using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoderAPI.DTOs.ProblemSession
{
    public class UserSolutionDto
    {
        public long UserSolutionId { get; set; }
        public long UserProblemSessionId { get; set; }
        public long ProblemId { get; set; }
        public string UserSolutionCode { get; set; } = null!;
        public string SelectedLanguage { get; set; } = null!;
        public DateTime SubmissionDate { get; set; }
        public string Result { get; set; } = null!;
        public decimal? Accuracy { get; set; }
        public List<UserTestCaseResultDto> TestCases { get; set; }  
    }
    public class UserTestCaseResultDto
    {
        public long UserTestCaseResultId { get; set; }
        public string Input { get; set; } = null!;
        public string ExpectedOutput { get; set; } = null!;
        public string ActualOutput { get; set; } = null!;
        public string Status { get; set; }
        public double ExecutionTime { get; set; }
        public double MemoryUsed { get; set; }
    }
    public class UserSolutionCardDto
    {
        public long UserSolutionId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string Result { get; set; } = null!;
        public string SelectedLanguage { get; set; } = null!;
        public double TotalExecutionTime { get; set; }
        public double TotalMemoryUser { get; set; }
    }
}
