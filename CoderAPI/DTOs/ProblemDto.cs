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
        public List<TopicString> Tags { get; set; }
    }
}
