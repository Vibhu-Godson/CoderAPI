using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserFeedback")]
public partial class UserFeedback
{
    [Key]
    public long UserFeedbackId { get; set; }

    public long UserId { get; set; }

    [StringLength(50)]
    public string FeedbackType { get; set; } = null!;

    [StringLength(1000)]
    public string? FeedbackText { get; set; }

    [StringLength(1000)]
    public string? FeedbackImageUrl { get; set; }

    [StringLength(200)]
    public string? DeviceInfo { get; set; }

    [StringLength(200)]
    public string? BrowserInfo { get; set; }

    [StringLength(50)]
    public string? AppVersion { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public int? Rating { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserFeedbacks")]
    public virtual User User { get; set; } = null!;
}
