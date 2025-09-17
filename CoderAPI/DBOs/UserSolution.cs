using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserSolution")]
public partial class UserSolution
{
    [Key]
    public long UserSolutionId { get; set; }

    public long UserProblemSessionId { get; set; }

    public long UserId { get; set; }

    public long ProblemId { get; set; }

    public string UserSolutionCode { get; set; } = null!;

    [StringLength(50)]
    public string SelectedLanguage { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime SubmissionDate { get; set; }

    [StringLength(50)]
    public string Result { get; set; } = null!;

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Accuracy { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("UserSolutions")]
    public virtual Problem Problem { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserSolutions")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("UserProblemSessionId")]
    [InverseProperty("UserSolutions")]
    public virtual UserProblemSession UserProblemSession { get; set; } = null!;
}
