using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoderAPI.DTOs.Session
{
    public class UserSessionChatDto
    {
        public long UserSessionChatId { get; set; }

        public long UserProblemSessionId { get; set; }

        public string ChatMessage { get; set; } = null!;

        public decimal? Correctness { get; set; }

        public decimal? Completeness { get; set; }

        public decimal? Clarity { get; set; }

        public decimal? Alignment { get; set; }

        public decimal? Readiness { get; set; }

        public DateTime SentOn { get; set; }

        public string MessageType { get; set; } = null!;

        public string? AiResponse { get; set; }

        public string? AiReply { get; set; }

        public string? AiExplaination { get; set; }
        public bool IsAfterSubmit { get; set; }
    }
}
