namespace CoderAPI.DTOs.Feedback
{
    public class UserFeedbackDto
    {
        public long UserFeedbackId { get; set; }
        public string FeedbackType { get; set; } = string.Empty;
        public string? FeedbackText { get; set; }
        public string? FeedbackImages { get; set; }
        public string DeviceInfo { get; set; } = string.Empty;
        public string BrowserInfo { get; set; } = string.Empty;
        public string AppVersion { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public int Rating { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class UserFeedbackBar
    {
        public long UserFeedbackId { get; set; }
        public string FeedbackType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public int Rating { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
