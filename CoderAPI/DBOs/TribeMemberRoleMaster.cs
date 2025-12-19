using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeMemberRoleMaster")]
public partial class TribeMemberRoleMaster
{
    [Key]
    public long TribeMemberRoleMasterId { get; set; }

    [StringLength(100)]
    public string TribeRoleName { get; set; } = null!;

    public string? TribeRoleDesc { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("TribeMemberRoleMaster")]
    public virtual ICollection<TribeMember> TribeMembers { get; set; } = new List<TribeMember>();

    [InverseProperty("TribeMemberRoleMaster")]
    public virtual ICollection<TribeRoleResponsibilityMaster> TribeRoleResponsibilityMasters { get; set; } = new List<TribeRoleResponsibilityMaster>();
}
