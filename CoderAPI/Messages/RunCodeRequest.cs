using CoderAPI.DTOs;
using CoderAPI.DTOs.TestCase;

namespace CoderAPI.Messages
{
    public class RunCodeRequest
    {
        public long UserSolutionId { get; set; }
        public long UserProblemSessionId { get; set; }
        public long ProblemId { get; set; }
        public string Code { get; set; }
        public string Language { get; set; }
        public bool IsSubmit { get; set; }// if true run against all (hidden) testcases; else sample tests
        public ListDto<TestCaseDto>? Testcases { get; set; }
    }
}
