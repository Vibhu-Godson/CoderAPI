namespace CoderAPI.DTOs.ProblemSession
{
    public class UserChatDto
    {
        public List<UserChatMessageDto> messages { get; set; }
    }
    public class UserChatMessageDto
    {
        public string MessageBy { get; set; }
        public string MessageContent { get; set; }
    }
    public class UserChatCardDto
    {
        public long UserProblemSessionId { get; set; }
        public DateTime Date { get; set; }
        public string SessionStatus { get; set; } = string.Empty;
        public string TotalDiscussionTime { get; set; }
    }
}
