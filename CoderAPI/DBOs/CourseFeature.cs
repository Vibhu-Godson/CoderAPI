using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("CourseFeature")]
public partial class CourseFeature
{
    [Key]
    public long CourseFeatureId { get; set; }

    public long CourseId { get; set; }

    public long FeatureId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("CourseId")]
    [InverseProperty("CourseFeatures")]
    public virtual Course Course { get; set; } = null!;

    [ForeignKey("FeatureId")]
    [InverseProperty("CourseFeatures")]
    public virtual Feature Feature { get; set; } = null!;
}
