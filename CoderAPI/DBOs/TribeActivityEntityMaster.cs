using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeActivityEntityMaster")]
public partial class TribeActivityEntityMaster
{
    [Key]
    public long TribeActivityEntityMasterId { get; set; }

    [StringLength(150)]
    public string Name { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("TribeActivityEntityMaster")]
    public virtual ICollection<TribeActivity> TribeActivities { get; set; } = new List<TribeActivity>();
}
