using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Tag")]
public partial class Tag
{
    [Key]
    public long TagId { get; set; }

    [StringLength(25)]
    public string TagName { get; set; } = null!;

    [StringLength(1000)]
    public string TagDescription { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Tag")]
    public virtual ICollection<ProblemTag> ProblemTags { get; set; } = new List<ProblemTag>();
}
