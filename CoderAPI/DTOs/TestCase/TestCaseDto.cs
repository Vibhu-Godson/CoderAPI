namespace CoderAPI.DTOs.TestCase
{
    public class TestCaseDto
    {
        public long TestCaseId { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public string Explaination { get; set; }
    }
}
