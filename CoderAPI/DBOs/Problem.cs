using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Problem")]
public partial class Problem
{
    [Key]
    public long ProblemId { get; set; }

    [StringLength(255)]
    public string ProblemName { get; set; } = null!;

    public string ProblemDetail { get; set; } = null!;

    [StringLength(50)]
    public string DifficultyLevel { get; set; } = null!;

    public string? Constraints { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Problem")]
    public virtual ICollection<ProblemTopic> ProblemTopics { get; set; } = new List<ProblemTopic>();

    [InverseProperty("Problem")]
    public virtual ICollection<TestCase> TestCases { get; set; } = new List<TestCase>();

    [InverseProperty("Problem")]
    public virtual ICollection<UserProblemSession> UserProblemSessions { get; set; } = new List<UserProblemSession>();

    [InverseProperty("Problem")]
    public virtual ICollection<UserSolution> UserSolutions { get; set; } = new List<UserSolution>();
}
