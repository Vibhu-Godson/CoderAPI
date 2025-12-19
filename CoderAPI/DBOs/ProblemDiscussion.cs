using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDiscussion")]
public partial class ProblemDiscussion
{
    [Key]
    public long ProblemDiscussionId { get; set; }

    public long ProblemId { get; set; }

    public long UserId { get; set; }

    public long? ParentDiscussionId { get; set; }

    public long? UserSolutionId { get; set; }

    public long? UserProblemSessionId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public bool IsEdited { get; set; }

    public bool IsActive { get; set; }

    [StringLength(500)]
    public string DiscussionTitle { get; set; } = null!;

    [StringLength(1000)]
    public string? ShortDiscussionText { get; set; }

    public string? LongDiscussionText { get; set; }

    [InverseProperty("ParentDiscussion")]
    public virtual ICollection<ProblemDiscussion> InverseParentDiscussion { get; set; } = new List<ProblemDiscussion>();

    [ForeignKey("ParentDiscussionId")]
    [InverseProperty("InverseParentDiscussion")]
    public virtual ProblemDiscussion? ParentDiscussion { get; set; }

    [InverseProperty("ProblemDiscussion")]
    public virtual ICollection<ProblemDiscussionReaction> ProblemDiscussionReactions { get; set; } = new List<ProblemDiscussionReaction>();

    [InverseProperty("ProblemDiscussion")]
    public virtual ICollection<ProblemDiscussionTag> ProblemDiscussionTags { get; set; } = new List<ProblemDiscussionTag>();

    [InverseProperty("ProblemDiscussion")]
    public virtual ICollection<ProblemDiscussionView> ProblemDiscussionViews { get; set; } = new List<ProblemDiscussionView>();

    [ForeignKey("UserId")]
    [InverseProperty("ProblemDiscussions")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("UserProblemSessionId")]
    [InverseProperty("ProblemDiscussions")]
    public virtual UserProblemSession? UserProblemSession { get; set; }

    [ForeignKey("UserSolutionId")]
    [InverseProperty("ProblemDiscussions")]
    public virtual UserSolution? UserSolution { get; set; }
}
