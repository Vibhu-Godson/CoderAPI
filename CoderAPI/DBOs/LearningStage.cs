using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("LearningStage")]
public partial class LearningStage
{
    [Key]
    public long LearningStageId { get; set; }

    [StringLength(255)]
    public string StageName { get; set; } = null!;

    public string? StageDescription { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("LearningStage")]
    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();
}
