using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

public partial class PostMedium
{
    [Key]
    public long PostMediaId { get; set; }

    public long PostId { get; set; }

    public long MediaTypeId { get; set; }

    [Column("MediaURL")]
    [StringLength(500)]
    public string MediaUrl { get; set; } = null!;

    [Column("ThumbnailURL")]
    [StringLength(500)]
    public string? ThumbnailUrl { get; set; }

    public int Sequence { get; set; }

    public string? Metadata { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("MediaTypeId")]
    [InverseProperty("PostMedia")]
    public virtual MediaType MediaType { get; set; } = null!;

    [ForeignKey("PostId")]
    [InverseProperty("PostMedia")]
    public virtual Post Post { get; set; } = null!;
}
