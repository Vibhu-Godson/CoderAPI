namespace CoderAPI.DTOs
{
    public class StatusResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
    }

    public class ListDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
    public class ListPageDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages 
        { 
            get 
            {
                return (int)Math.Ceiling((double)TotalCount / PageSize);
            } 
        }
    }
}
