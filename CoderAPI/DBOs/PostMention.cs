using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("PostMention")]
public partial class PostMention
{
    [Key]
    public long PostMentionId { get; set; }

    public long PostId { get; set; }

    public long MentionedByUserId { get; set; }

    public long MentionedUserId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("MentionedByUserId")]
    [InverseProperty("PostMentionMentionedByUsers")]
    public virtual User MentionedByUser { get; set; } = null!;

    [ForeignKey("MentionedUserId")]
    [InverseProperty("PostMentionMentionedUsers")]
    public virtual User MentionedUser { get; set; } = null!;

    [ForeignKey("PostId")]
    [InverseProperty("PostMentions")]
    public virtual Post Post { get; set; } = null!;
}
