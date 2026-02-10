using System.ComponentModel.DataAnnotations;

namespace CoderAPI.DTOs
{
    public class UserDto
    {
        public long UserId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; }
        public string? PhoneNumber { get; set; } // Optional WhatsApp number
        public string LoginPassword { get; set; }
        public byte[]? ProfileImage { get; set; }
        public string? Country { get; set; }
    }
}
