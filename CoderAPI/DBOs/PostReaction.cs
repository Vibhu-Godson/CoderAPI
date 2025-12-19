using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("PostReaction")]
[Index("PostId", "UserId", Name = "UQ_PostReaction_PostId_UserId", IsUnique = true)]
public partial class PostReaction
{
    [Key]
    public long PostReactionId { get; set; }

    public long PostId { get; set; }

    public long UserId { get; set; }

    [StringLength(50)]
    public string ReactionType { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("PostId")]
    [InverseProperty("PostReactions")]
    public virtual Post Post { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("PostReactions")]
    public virtual User User { get; set; } = null!;
}
