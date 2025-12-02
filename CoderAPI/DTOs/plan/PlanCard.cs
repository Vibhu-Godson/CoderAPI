namespace CoderAPI.DTOs.plan
{
    public class PlanCard
    {
        public long PlanId { get; set; }
        public string Name { get; set; }
        public long Price { get; set; }
        public string Description { get; set; }
        public List<FeatureDto> Features { get; set; }
        public bool IsPopular { get; set; }
        public bool IsCurrentPlan { get; set; }
    }
    public class FeatureDto
    {
        public string feature { get; set; }
        public bool Included { get; set; }
    }
}
