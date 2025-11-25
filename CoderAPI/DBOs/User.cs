using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("User")]
[Index("Email", Name = "UQ_Email", IsUnique = true)]
[Index("PhoneNumber", Name = "UQ_Phone", IsUnique = true)]
[Index("UserName", Name = "UQ_UserName", IsUnique = true)]
public partial class User
{
    [Key]
    public long UserId { get; set; }

    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(15)]
    public string? PhoneNumber { get; set; }

    [StringLength(255)]
    public string? GoogleId { get; set; }

    [StringLength(255)]
    public string? FacebookId { get; set; }

    [StringLength(255)]
    public string? LoginPassword { get; set; }

    public byte[]? ProfileImage { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? TimeZone { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [StringLength(50)]
    public string UserName { get; set; } = null!;

    [InverseProperty("User")]
    public virtual ICollection<ProblemDiscussionReaction> ProblemDiscussionReactions { get; set; } = new List<ProblemDiscussionReaction>();

    [InverseProperty("User")]
    public virtual ICollection<ProblemDiscussionTag> ProblemDiscussionTags { get; set; } = new List<ProblemDiscussionTag>();

    [InverseProperty("User")]
    public virtual ICollection<ProblemDiscussionView> ProblemDiscussionViews { get; set; } = new List<ProblemDiscussionView>();

    [InverseProperty("User")]
    public virtual ICollection<ProblemDiscussion> ProblemDiscussions { get; set; } = new List<ProblemDiscussion>();

    [InverseProperty("User")]
    public virtual ICollection<UserDetail> UserDetails { get; set; } = new List<UserDetail>();

    [InverseProperty("User")]
    public virtual ICollection<UserFeedback> UserFeedbacks { get; set; } = new List<UserFeedback>();

    [InverseProperty("User")]
    public virtual ICollection<UserProblemSession> UserProblemSessions { get; set; } = new List<UserProblemSession>();

    [InverseProperty("User")]
    public virtual ICollection<UserSolution> UserSolutions { get; set; } = new List<UserSolution>();
}
