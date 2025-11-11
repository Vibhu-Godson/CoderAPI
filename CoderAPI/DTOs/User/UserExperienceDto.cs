namespace CoderAPI.DTOs.User
{
    public class UserExperienceDto
    {
        public string? Company { get; set; }
        public string? Role { get; set; }
        public string? StartDate { get; set; }
        public string? Enddate { get; set; }
        public string? Description { get; set; }
    }

    public class UserEducationDto
    {
        public string? Institute { get; set; }
        public string? Degree { get; set; }
        public string? FieldOfStudy { get; set; }
        public string? CompletionYear { get; set; }
    }

    public class UserProjectDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? TechStacks { get; set; }
        public string? ProjectLink { get; set; }
    }

    public class UserOnboardChatResponse
    {
        public string? CurrentRole { get; set; }
        public UserExperienceDto Experience { get; set; }
        public UserEducationDto Education { get; set; }
        public UserProjectDto Project { get; set; }
        public string? Motivation { get; set; }
    }
}
