using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserPostConsumption")]
[Index("PostId", "UserId", Name = "UQ_UserPostConsumption_PostId_UserId", IsUnique = true)]
public partial class UserPostConsumption
{
    [Key]
    public long UserPostConsumptionId { get; set; }

    public long PostId { get; set; }

    public long UserId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ConsumedAt { get; set; }

    [StringLength(50)]
    public string ConsumptionStatus { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("PostId")]
    [InverseProperty("UserPostConsumptions")]
    public virtual Post Post { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserPostConsumptions")]
    public virtual User User { get; set; } = null!;
}
