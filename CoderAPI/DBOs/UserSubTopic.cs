using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserSubTopic")]
public partial class UserSubTopic
{
    [Key]
    public long UserSubTopicId { get; set; }

    public long UserId { get; set; }

    public long SubTopicId { get; set; }

    [StringLength(50)]
    public string ProgressStatus { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime LastAccessedOn { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public long? UserCourseId { get; set; }

    [ForeignKey("SubTopicId")]
    [InverseProperty("UserSubTopics")]
    public virtual SubTopic SubTopic { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserSubTopics")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("UserCourseId")]
    [InverseProperty("UserSubTopics")]
    public virtual UserCourse? UserCourse { get; set; }
}
