using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Plann")]
public partial class Plann
{
    [Key]
    public long PlanId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    public long Price { get; set; }

    public int? DurationDays { get; set; }

    [StringLength(50)]
    public string? PlanType { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Plan")]
    public virtual ICollection<PlanFeature> PlanFeatures { get; set; } = new List<PlanFeature>();

    [InverseProperty("Plan")]
    public virtual ICollection<UserPlan> UserPlans { get; set; } = new List<UserPlan>();
}
