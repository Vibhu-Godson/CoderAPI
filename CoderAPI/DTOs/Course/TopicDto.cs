namespace CoderAPI.DTOs.Course
{
    public class TopicLockDto
    {
        public long TopicId { get; set; }
        public string TopicName { get; set; }
        public string TopicDescription { get; set; }
        public int SortOrder { get; set; }
    }

    public class TopicAssetDto
    {
        public long TopicAssetId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AssetType { get; set; } // e.g., "Video", "Document"
        public string FileUrl { get; set; }
        public int DurationMinutes { get; set; } // For video assets
        public int SortOrder { get; set; }
    }

    public class TopicDto
    {
        public long TopicId { get; set; }
        public string TopicName { get; set; }
        public string TopicDescription { get; set; }
        public int SortOrder { get; set; }
        public List<TopicAssetDto> Assets { get; set; }
    }
}
