namespace CoderAPI.DTOs.Course
{
    public class CourseListItemDto
    {
        public long CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Level { get; set; }
        public int DurationInHours { get; set; }
        public bool IsEnrolled { get; set; } // true if user already purchased
    }

    public class CourseDetailDto
    {
        public long CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Level { get; set; }
        public int DurationInHours { get; set; }
        public List<TopicDto> Topics { get; set; }
    }
}
