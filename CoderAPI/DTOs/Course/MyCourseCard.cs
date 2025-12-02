namespace CoderAPI.DTOs.Course
{
    public class MyCourseCard
    {
        public long UserCourseId { get; set; }
        public long CourseId { get; set; }
        public string CourseName { get; set; }
        public decimal OverAllProgress { get; set; }
    }
    public class MyCourseDetail
    {
        public long UserCourseId { get; set; }
        public long CourseId { get; set; }
        public string CourseName { get; set; }
        public decimal OverAllProgress { get; set; }
        public List<TopicLockDto> Topics { get; set; }
    }
    public class MyTopic
    {
        public long TopicId { get; set; }
        public long UserTopicId { get; set; }
        public long UserCourseId { get; set; }
        public string Status { get; set; }
        public decimal ProgressPercent { get; set; }
        public DateTime LastAccessedOn { get; set; }
        public List<MyTopicAssets> TopicAssets { get; set; }
    }

    public class MyTopicAssets
    {
        public long UserTopicAssetId { get; set; }
        public long UserTopicId { get; set; }
        public long TopicAssetId { get; set; }
        public string Status { get; set; }
        public decimal ProgressPercent { get; set; }
    }
}
