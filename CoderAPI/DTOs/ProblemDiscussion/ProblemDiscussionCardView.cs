using CoderAPI.DBOs;

namespace CoderAPI.DTOs.ProblemDiscussion
{
    public class ProblemDiscussionCardView
    {
        public long ProblemDiscussionId { get; set; }
        public int ViewCount { get; set; }
        public int CommentCount { get; set; }
        public List<ProblemDiscussionTagDto> Tags { get; set; }
        public ProblemDiscussionReactionDto Reactions { get; set; }
        public string Header { get; set; }
        public string UserName { get; set; }
        public byte[]? UserImage { get; set; }
        public DateTime CreatedOn { get; set; }
    }   
}
