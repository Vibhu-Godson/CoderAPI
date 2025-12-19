using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("OrgMember")]
public partial class OrgMember
{
    [Key]
    public long OrgMemberId { get; set; }

    public long OrganizationId { get; set; }

    [StringLength(150)]
    public string MailOfOrgMember { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("OrganizationId")]
    [InverseProperty("OrgMembers")]
    public virtual Organization Organization { get; set; } = null!;
}
