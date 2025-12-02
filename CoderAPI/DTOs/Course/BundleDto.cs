namespace CoderAPI.DTOs.Course
{
    public class BundleDto
    {
        public long BundleId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public List<CourseCard> Courses { get; set; }
    }
    public class BundleCard
    {
        public long BundleId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
    }
}
