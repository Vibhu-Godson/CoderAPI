using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("PlanFeature")]
public partial class PlanFeature
{
    [Key]
    public long PlanFeatureId { get; set; }

    public long PlanId { get; set; }

    public long FeatureId { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("FeatureId")]
    [InverseProperty("PlanFeatures")]
    public virtual Feature Feature { get; set; } = null!;

    [ForeignKey("PlanId")]
    [InverseProperty("PlanFeatures")]
    public virtual Plann Plan { get; set; } = null!;
}
