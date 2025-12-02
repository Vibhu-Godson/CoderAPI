using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemTag")]
public partial class ProblemTag
{
    [Key]
    public long ProblemTagId { get; set; }

    public long TagId { get; set; }

    public long ProblemId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("ProblemTags")]
    public virtual Problem Problem { get; set; } = null!;

    [ForeignKey("TagId")]
    [InverseProperty("ProblemTags")]
    public virtual Tag Tag { get; set; } = null!;
}
