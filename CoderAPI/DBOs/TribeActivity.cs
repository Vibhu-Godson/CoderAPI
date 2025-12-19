using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeActivity")]
public partial class TribeActivity
{
    [Key]
    public long TribeActivityId { get; set; }

    public long TribeId { get; set; }

    public long UserId { get; set; }

    public long TribeActivityEntityMasterId { get; set; }

    public long ActivityEntityId { get; set; }

    public long? ParentTribeActivityId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("ParentTribeActivity")]
    public virtual ICollection<TribeActivity> InverseParentTribeActivity { get; set; } = new List<TribeActivity>();

    [ForeignKey("ParentTribeActivityId")]
    [InverseProperty("InverseParentTribeActivity")]
    public virtual TribeActivity? ParentTribeActivity { get; set; }

    [ForeignKey("TribeId")]
    [InverseProperty("TribeActivities")]
    public virtual Tribe Tribe { get; set; } = null!;

    [ForeignKey("TribeActivityEntityMasterId")]
    [InverseProperty("TribeActivities")]
    public virtual TribeActivityEntityMaster TribeActivityEntityMaster { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("TribeActivities")]
    public virtual User User { get; set; } = null!;
}
