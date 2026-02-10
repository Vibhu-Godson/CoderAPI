namespace CoderAPI.DTOs.ProblemSession
{
    public class ProblemEvents
    {
        public long ProblemId { get; set; }
        public long UserProblemSessionId { get; set; }
        public string EventType { get; set; }
        public object Payload { get; set; }


    }
}
