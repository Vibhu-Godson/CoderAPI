using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("EventParticipant")]
[Index("WorkshopEventId", "UserId", Name = "UQ_EventParticipant_WorkshopEventId_UserId", IsUnique = true)]
public partial class EventParticipant
{
    [Key]
    public long EventParticipantId { get; set; }

    public long WorkshopEventId { get; set; }

    public long UserId { get; set; }

    public long TribeId { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TribeId")]
    [InverseProperty("EventParticipants")]
    public virtual Tribe Tribe { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("EventParticipants")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("WorkshopEventId")]
    [InverseProperty("EventParticipants")]
    public virtual WorkshopEvent WorkshopEvent { get; set; } = null!;
}
