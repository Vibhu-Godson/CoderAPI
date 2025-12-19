using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Tribe")]
public partial class Tribe
{
    [Key]
    public long TribeId { get; set; }

    [StringLength(200)]
    public string TribeName { get; set; } = null!;

    public string? TribeDescription { get; set; }

    [StringLength(100)]
    public string TribeType { get; set; } = null!;

    [StringLength(50)]
    public string Visibility { get; set; } = null!;

    public long OwnerUserId { get; set; }

    public long? OrganizationId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastActiveDate { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Tribe")]
    public virtual ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();

    [ForeignKey("OrganizationId")]
    [InverseProperty("Tribes")]
    public virtual Organization? Organization { get; set; }

    [ForeignKey("OwnerUserId")]
    [InverseProperty("Tribes")]
    public virtual User OwnerUser { get; set; } = null!;

    [InverseProperty("Tribe")]
    public virtual ICollection<TribeActivity> TribeActivities { get; set; } = new List<TribeActivity>();

    [InverseProperty("Tribe")]
    public virtual ICollection<TribeGoalMap> TribeGoalMaps { get; set; } = new List<TribeGoalMap>();

    [InverseProperty("Tribe")]
    public virtual ICollection<TribeMember> TribeMembers { get; set; } = new List<TribeMember>();
}
