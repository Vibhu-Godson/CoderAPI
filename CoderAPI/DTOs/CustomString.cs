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
}
