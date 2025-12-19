using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeRoleResponsibilityMaster")]
public partial class TribeRoleResponsibilityMaster
{
    [Key]
    public long TribeRoleResponsibilityMasterId { get; set; }

    public long TribeMemberRoleMasterId { get; set; }

    [StringLength(1000)]
    public string Responsibility { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TribeMemberRoleMasterId")]
    [InverseProperty("TribeRoleResponsibilityMasters")]
    public virtual TribeMemberRoleMaster TribeMemberRoleMaster { get; set; } = null!;
}
