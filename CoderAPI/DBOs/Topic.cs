using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Topic")]
public partial class Topic
{
    [Key]
    public long TopicId { get; set; }

    public long LearningStageId { get; set; }

    [StringLength(255)]
    public string TopicName { get; set; } = null!;

    public string? TopicDescription { get; set; }

    public int? SortOrder { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("LearningStageId")]
    [InverseProperty("Topics")]
    public virtual LearningStage LearningStage { get; set; } = null!;

    [InverseProperty("Topic")]
    public virtual ICollection<ProblemTopic> ProblemTopics { get; set; } = new List<ProblemTopic>();

    [InverseProperty("Topic")]
    public virtual ICollection<SubTopic> SubTopics { get; set; } = new List<SubTopic>();
}
