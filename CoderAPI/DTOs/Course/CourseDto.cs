namespace CoderAPI.DTOs.Course
{
    public class LockCourseDto
    {
        public long CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int DurationHours { get; set; }
        public string Level { get; set; }
        public List<TopicLockDto> Topics { get; set; }
    }

    public class CourseDto
    {
        public long CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int DurationHours { get; set; }
        public string Level { get; set; }
        public string ImageUrl { get; set; }
        public List<TopicDto> Topics { get; set; }
    }
    public class CourseCard
    {
        public long CourseId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
    }
}
