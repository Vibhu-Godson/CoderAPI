namespace CoderAPI.DTOs.ProblemDiscussion
{
    public class ProblemDiscussionDto
    {
        public long ProblemDiscussionId { get; set; }
        public long ProblemId { get; set; }
        public List<ProblemDiscussionBlockDto> DiscussionBlocks { get; set; }
        public List<ProblemDiscussionTagDto> Tags { get; set; }
        public ProblemDiscussionReactionDto Reactions { get; set; }
        public List<ProblemDiscussionComments> Comments { get; set; }
        public int DiscussionViewCount { get; set; }
        public string UserName { get; set; }
        public byte[]? UserImage { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class ProblemDiscussionTagDto
    {
        public long ProblemDiscussionTagId { get; set; }
        public string TagName { get; set; } = string.Empty;
    }
    public class ProblemDiscussionBlockDto
    {
        public long ProblemDiscussionBlockId { get; set; }
        public long ProblemDiscussionId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int SortOrder { get; set; }
        public string BlockType { get; set; }
    }
    public class ProblemDiscussionComments
    {
        public DateTime CreatedOn { get; set; }
        public bool IsEdited { get; set; }
        public int CommentViewCount { get; set; }
        public List<ProblemDiscussionBlockDto> DiscussionBlocks { get; set; }
        public ProblemDiscussionReactionDto Reactions { get; set; }
        public string UserName { get; set; }
        public byte[]? UserImage { get; set; }

    }
    
    public class ProblemDiscussionReactionDto
    {
        public Dictionary<string,int> ReactionCounts { get; set; }
    }
}
