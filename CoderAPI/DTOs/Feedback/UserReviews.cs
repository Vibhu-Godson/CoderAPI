namespace CoderAPI.DTOs.Feedback
{
    public class UserReviews
    {
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
    }
}
