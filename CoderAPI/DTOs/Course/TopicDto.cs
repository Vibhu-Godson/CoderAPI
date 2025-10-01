namespace CoderAPI.DTOs.Course
{
    public class TopicDto
    {
        public long TopicId { get; set; }
        public string TopicName { get; set; }
        public string TopicDescription { get; set; }
        public List<SubTopicDto> SubTopics { get; set; }
    }

    public class SubTopicDto
    {
        public long SubTopicId { get; set; }
        public string SubTopicName { get; set; }
        public string ContentType { get; set; } // Video, Quiz, Assessment, Reading
        public string SubTopicContent { get; set; } // For Reading
        public string YouTubeUrl { get; set; } // For Video
        public int SortOrder { get; set; }
        public string ProgressStatus { get; set; } // NotStarted, InProgress, Completed
    }

}
