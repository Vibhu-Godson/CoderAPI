using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("WorkshopGoalMaster")]
public partial class WorkshopGoalMaster
{
    [Key]
    public long WorkshopGoalMasterId { get; set; }

    [StringLength(200)]
    public string Goal { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("WorkshopGoalMaster")]
    public virtual ICollection<WorkshopGoalMap> WorkshopGoalMaps { get; set; } = new List<WorkshopGoalMap>();
}
