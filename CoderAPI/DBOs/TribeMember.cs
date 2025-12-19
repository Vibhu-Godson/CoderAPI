using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TribeMember")]
[Index("TribeId", "UserId", Name = "UQ_TribeMember_TribeId_UserId", IsUnique = true)]
public partial class TribeMember
{
    [Key]
    public long TribeMemberId { get; set; }

    public long TribeId { get; set; }

    public long UserId { get; set; }

    public long TribeMemberRoleMasterId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime JoinedOn { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TribeId")]
    [InverseProperty("TribeMembers")]
    public virtual Tribe Tribe { get; set; } = null!;

    [ForeignKey("TribeMemberRoleMasterId")]
    [InverseProperty("TribeMembers")]
    public virtual TribeMemberRoleMaster TribeMemberRoleMaster { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("TribeMembers")]
    public virtual User User { get; set; } = null!;
}
