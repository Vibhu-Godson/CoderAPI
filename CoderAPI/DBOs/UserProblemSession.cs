using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserProblemSession")]
public partial class UserProblemSession
{
    [Key]
    public long UserProblemSessionId { get; set; }

    public long UserId { get; set; }

    public long ProblemId { get; set; }

    [StringLength(50)]
    public string SessionStatus { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime StartedOn { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndedOn { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("UserProblemSessions")]
    public virtual Problem Problem { get; set; } = null!;

    [InverseProperty("UserProblemSession")]
    public virtual ICollection<ProblemDiscussion> ProblemDiscussions { get; set; } = new List<ProblemDiscussion>();

    [ForeignKey("UserId")]
    [InverseProperty("UserProblemSessions")]
    public virtual User User { get; set; } = null!;

    [InverseProperty("UserProblemSession")]
    public virtual ICollection<UserSessionChat> UserSessionChats { get; set; } = new List<UserSessionChat>();

    [InverseProperty("UserProblemSession")]
    public virtual ICollection<UserSolution> UserSolutions { get; set; } = new List<UserSolution>();
}
