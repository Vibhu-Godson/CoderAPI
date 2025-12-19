using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("WorkshopGoalMap")]
public partial class WorkshopGoalMap
{
    [Key]
    public long WorkshopGoalMapId { get; set; }

    public long WorkshopId { get; set; }

    public long WorkshopGoalMasterId { get; set; }

    [StringLength(50)]
    public string GoalStatus { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("WorkshopId")]
    [InverseProperty("WorkshopGoalMaps")]
    public virtual Workshop Workshop { get; set; } = null!;

    [ForeignKey("WorkshopGoalMasterId")]
    [InverseProperty("WorkshopGoalMaps")]
    public virtual WorkshopGoalMaster WorkshopGoalMaster { get; set; } = null!;
}
