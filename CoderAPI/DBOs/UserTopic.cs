using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserTopic")]
[Index("UserCourseId", "TopicId", Name = "UQ_UserTopic", IsUnique = true)]
public partial class UserTopic
{
    [Key]
    public long UserTopicId { get; set; }

    public long UserCourseId { get; set; }

    public long TopicId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string Status { get; set; } = null!;

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? ProgressPercent { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastAccessedOn { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("TopicId")]
    [InverseProperty("UserTopics")]
    public virtual Topic Topic { get; set; } = null!;

    [ForeignKey("UserCourseId")]
    [InverseProperty("UserTopics")]
    public virtual UserCourse UserCourse { get; set; } = null!;

    [InverseProperty("UserTopic")]
    public virtual ICollection<UserTopicAsset> UserTopicAssets { get; set; } = new List<UserTopicAsset>();
}
