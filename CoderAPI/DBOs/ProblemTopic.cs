using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemTopic")]
public partial class ProblemTopic
{
    [Key]
    public long ProblemTopicId { get; set; }

    public long ProblemId { get; set; }

    public long TopicId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("ProblemId")]
    [InverseProperty("ProblemTopics")]
    public virtual Problem Problem { get; set; } = null!;

    [ForeignKey("TopicId")]
    [InverseProperty("ProblemTopics")]
    public virtual Topic Topic { get; set; } = null!;
}
