using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDiscussionTag")]
public partial class ProblemDiscussionTag
{
    [Key]
    public long ProblemDiscussionTagId { get; set; }

    public long UserId { get; set; }

    public long ProblemDiscussionId { get; set; }

    [StringLength(30)]
    public string TagName { get; set; } = null!;

    [ForeignKey("ProblemDiscussionId")]
    [InverseProperty("ProblemDiscussionTags")]
    public virtual ProblemDiscussion ProblemDiscussion { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("ProblemDiscussionTags")]
    public virtual User User { get; set; } = null!;
}
