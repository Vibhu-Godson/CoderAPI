using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Organization")]
public partial class Organization
{
    [Key]
    public long OrganizationId { get; set; }

    [StringLength(200)]
    public string OrgName { get; set; } = null!;

    public string? OrgDescription { get; set; }

    [StringLength(100)]
    public string OrgType { get; set; } = null!;

    [Column("OrgPOCName")]
    [StringLength(150)]
    public string OrgPocname { get; set; } = null!;

    [StringLength(150)]
    public string OrgEmail { get; set; } = null!;

    [Column("OrgPOCEmail")]
    [StringLength(150)]
    public string OrgPocemail { get; set; } = null!;

    [Column("OrgPOCPhone")]
    [StringLength(20)]
    public string OrgPocphone { get; set; } = null!;

    public string? OrgAddress { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Organization")]
    public virtual ICollection<OrgMember> OrgMembers { get; set; } = new List<OrgMember>();

    [InverseProperty("Organization")]
    public virtual ICollection<Tribe> Tribes { get; set; } = new List<Tribe>();

    [InverseProperty("OrganizedBy")]
    public virtual ICollection<Workshop> WorkshopOrganizedBies { get; set; } = new List<Workshop>();

    [InverseProperty("SponsoredBy")]
    public virtual ICollection<Workshop> WorkshopSponsoredBies { get; set; } = new List<Workshop>();
}
