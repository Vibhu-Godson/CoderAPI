using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TestCase")]
public partial class TestCase
{
    [Key]
    public long TestCaseId { get; set; }

    public long ProblemId { get; set; }

    public string TestCaseDetail { get; set; } = null!;

    public string ExpectedOutput { get; set; } = null!;

    public bool? IsEdgeCase { get; set; }

    public bool? IsHidden { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("TestCases")]
    public virtual Problem Problem { get; set; } = null!;
}
