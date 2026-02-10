namespace CoderAPI.DTOs.Post
{
    public class PostDto
    {
    }
    public class PostShow
    {
        public long PostId { get; set; }
        public string AuthorUserName { get; set; }
        public string Text { get; set; }
        public List<string> MediaCdnUrl { get; set; }
        public Dictionary<string,int> Reactions { get; set; }
        public string MyReaction { get; set; }
        public int CommentCount { get; set; }
        public string TopComment { get; set; }
        public Dictionary<string, object> Context { get; set; }

    }
}
