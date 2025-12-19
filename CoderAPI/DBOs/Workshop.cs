using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Workshop")]
public partial class Workshop
{
    [Key]
    public long WorkshopId { get; set; }

    public long OrganizedById { get; set; }

    public long? SponsoredById { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EndDate { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("OrganizedById")]
    [InverseProperty("WorkshopOrganizedBies")]
    public virtual Organization OrganizedBy { get; set; } = null!;

    [ForeignKey("SponsoredById")]
    [InverseProperty("WorkshopSponsoredBies")]
    public virtual Organization? SponsoredBy { get; set; }

    [InverseProperty("Workshop")]
    public virtual ICollection<WorkshopEvent> WorkshopEvents { get; set; } = new List<WorkshopEvent>();

    [InverseProperty("Workshop")]
    public virtual ICollection<WorkshopGoalMap> WorkshopGoalMaps { get; set; } = new List<WorkshopGoalMap>();
}
