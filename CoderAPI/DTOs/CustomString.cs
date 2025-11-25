namespace CoderAPI.DTOs
{
    public class CustomString
    {
        public string Value { get; set; }
    }

    public class TagString : CustomString
    {
        public long TagId { get; set; }
    }
    public class Language : CustomString
    {
        public long ProblemDetailId { get; set; }
    }
    public class UserChatRequest
    {
        public string Value { get; set; }
        public string Placeholder { get; set; }
    }
}
