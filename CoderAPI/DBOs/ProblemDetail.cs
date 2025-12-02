using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDetail")]
public partial class ProblemDetail
{
    [Key]
    public long ProblemDetailId { get; set; }

    public long ProblemId { get; set; }

    [StringLength(10)]
    public string LanguageName { get; set; } = null!;

    public string? StarterCode { get; set; }

    public string? HiddenCode { get; set; }

    public string? GoldenSolution { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("ProblemDetails")]
    public virtual Problem Problem { get; set; } = null!;
}
