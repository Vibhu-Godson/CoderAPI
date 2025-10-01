using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("CourseTopic")]
public partial class CourseTopic
{
    [Key]
    public long CourseTopicId { get; set; }

    public long CourseId { get; set; }

    public long TopicId { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("CourseId")]
    [InverseProperty("CourseTopics")]
    public virtual Course Course { get; set; } = null!;

    [ForeignKey("TopicId")]
    [InverseProperty("CourseTopics")]
    public virtual Topic Topic { get; set; } = null!;
}
