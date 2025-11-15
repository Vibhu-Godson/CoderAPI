namespace CoderAPI.DTOs.Settings
{
    public class SettingResponseDto
    {
        public List<SettingCategoryDto> Categories { get; set; } = new();
    }

    public class SettingCategoryDto
    {
        public string Category { get; set; }
        public List<SettingItemDto> Settings { get; set; } = new();
    }

    public class SettingItemDto
    {
        public int SettingId { get; set; }
        public string Key { get; set; }
        public string Label { get; set; }
        public string DataType { get; set; }
        public object Value { get; set; }
        public object DefaultValue { get; set; }
        public string Description { get; set; }
        public object Meta { get; set; }     // stored as JSON, returned as object
    }

}
