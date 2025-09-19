using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserSessionChat")]
public partial class UserSessionChat
{
    [Key]
    public long UserSessionChatId { get; set; }

    public long UserProblemSessionId { get; set; }

    public string ChatMessage { get; set; } = null!;

    [Column(TypeName = "decimal(2, 2)")]
    public decimal? Correctness { get; set; }

    [Column(TypeName = "decimal(2, 2)")]
    public decimal? Completeness { get; set; }

    [Column(TypeName = "decimal(2, 2)")]
    public decimal? Clarity { get; set; }

    [Column(TypeName = "decimal(2, 2)")]
    public decimal? Alignment { get; set; }

    [Column(TypeName = "decimal(2, 2)")]
    public decimal? Readiness { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime SentOn { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [StringLength(50)]
    public string MessageType { get; set; } = null!;

    [ForeignKey("UserProblemSessionId")]
    [InverseProperty("UserSessionChats")]
    public virtual UserProblemSession UserProblemSession { get; set; } = null!;
}
