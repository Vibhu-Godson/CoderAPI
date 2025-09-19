using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserTestCaseResult")]
public partial class UserTestCaseResult
{
    [Key]
    public long UserTestCaseResultId { get; set; }

    public long UserSolutionId { get; set; }

    public long TestCaseId { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public string? Stdout { get; set; }

    public string? Stderr { get; set; }

    public string? CompileOutput { get; set; }

    public double? ExecutionTime { get; set; }

    public long? MemoryUsed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TestCaseId")]
    [InverseProperty("UserTestCaseResults")]
    public virtual TestCase TestCase { get; set; } = null!;

    [ForeignKey("UserSolutionId")]
    [InverseProperty("UserTestCaseResults")]
    public virtual UserSolution UserSolution { get; set; } = null!;
}
