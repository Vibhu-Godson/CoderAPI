using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDiscussionReaction")]
public partial class ProblemDiscussionReaction
{
    [Key]
    public long ReactionId { get; set; }

    public long ProblemDiscussionId { get; set; }

    public long UserId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string ReactionType { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("ProblemDiscussionId")]
    [InverseProperty("ProblemDiscussionReactions")]
    public virtual ProblemDiscussion ProblemDiscussion { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("ProblemDiscussionReactions")]
    public virtual User User { get; set; } = null!;
}
