namespace CoderAPI.DTOs
{
    public class CustomString
    {
        public string Value { get; set; }
    }

    public class TopicString : CustomString
    {
        public long TopicId { get; set; }
    }
}
