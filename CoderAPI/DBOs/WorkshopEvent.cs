using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("WorkshopEvent")]
public partial class WorkshopEvent
{
    [Key]
    public long WorkshopEventId { get; set; }

    public long WorkshopId { get; set; }

    public long EventMasterId { get; set; }

    [StringLength(50)]
    public string Complexity { get; set; } = null!;

    [StringLength(50)]
    public string ParticipationMode { get; set; } = null!;

    [StringLength(50)]
    public string EvaluationType { get; set; } = null!;

    public string? EventMetadata { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("WorkshopEvent")]
    public virtual ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();

    [ForeignKey("WorkshopId")]
    [InverseProperty("WorkshopEvents")]
    public virtual Workshop Workshop { get; set; } = null!;
}
