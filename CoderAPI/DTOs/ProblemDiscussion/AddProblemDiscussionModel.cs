namespace CoderAPI.DTOs.ProblemDiscussion
{
    public class AddProblemDiscussionModel
    {
        public long ProblemId { get; set; }
        public long? ParentDiscussionId { get; set; }
        public long? UserSolutionId { get; set; }
        public long? UserProblemSessionId { get; set; }
        public List<ProblemDiscussionBlockDto> Blocks { get; set; }
        public List<ProblemDiscussionTagDto> Tags { get; set; }
    }
}
