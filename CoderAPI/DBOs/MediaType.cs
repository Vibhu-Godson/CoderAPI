using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("MediaType")]
public partial class MediaType
{
    [Key]
    public long MediaTypeId { get; set; }

    [StringLength(100)]
    public string MediaTypeName { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("MediaType")]
    public virtual ICollection<PostMedium> PostMedia { get; set; } = new List<PostMedium>();
}
