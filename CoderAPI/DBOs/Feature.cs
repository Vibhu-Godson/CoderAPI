using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Feature")]
[Index("FeatureCode", Name = "UQ__Feature__75CE31548F4225C9", IsUnique = true)]
public partial class Feature
{
    [Key]
    public long FeatureId { get; set; }

    [StringLength(100)]
    public string FeatureCode { get; set; } = null!;

    [StringLength(255)]
    public string? FeatureDescription { get; set; }

    [StringLength(50)]
    public string? FeatureType { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Feature")]
    public virtual ICollection<PlanFeature> PlanFeatures { get; set; } = new List<PlanFeature>();
}
