using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeGoalMap")]
[Index("TribeId", "TribeGoalMasterId", Name = "UQ_TribeGoalMap_TribeId_TribeGoalMasterId", IsUnique = true)]
public partial class TribeGoalMap
{
    [Key]
    public long TribeGoalMapId { get; set; }

    public long TribeId { get; set; }

    public long TribeGoalMasterId { get; set; }

    [StringLength(50)]
    public string GoalStatus { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TribeId")]
    [InverseProperty("TribeGoalMaps")]
    public virtual Tribe Tribe { get; set; } = null!;

    [ForeignKey("TribeGoalMasterId")]
    [InverseProperty("TribeGoalMaps")]
    public virtual TribeGoalMaster TribeGoalMaster { get; set; } = null!;
}
