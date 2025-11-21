using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDiscussionView")]
public partial class ProblemDiscussionView
{
    [Key]
    public long ProblemDiscussionViewId { get; set; }

    public long ProblemDiscussionId { get; set; }

    public long UserId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ViewedOn { get; set; }

    public int? LatestBlockSeenOrder { get; set; }

    [ForeignKey("ProblemDiscussionId")]
    [InverseProperty("ProblemDiscussionViews")]
    public virtual ProblemDiscussion ProblemDiscussion { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("ProblemDiscussionViews")]
    public virtual User User { get; set; } = null!;
}
