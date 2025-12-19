using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeGoalMaster")]
public partial class TribeGoalMaster
{
    [Key]
    public long TribeGoalMasterId { get; set; }

    [StringLength(200)]
    public string Goal { get; set; } = null!;

    public string? GoalDescription { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("TribeGoalMaster")]
    public virtual ICollection<TribeGoalMap> TribeGoalMaps { get; set; } = new List<TribeGoalMap>();
}
