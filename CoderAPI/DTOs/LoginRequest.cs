namespace CoderAPI.DTOs
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class LoginResponse
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public string Message { get; set; }
        public bool Status { get; set; }
    }
}
