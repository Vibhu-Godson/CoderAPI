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

    [InverseProperty("Topic")]
    public virtual ICollection<CourseTopic> CourseTopics { get; set; } = new List<CourseTopic>();

    [InverseProperty("Topic")]
    public virtual ICollection<TopicAsset> TopicAssets { get; set; } = new List<TopicAsset>();

    [InverseProperty("Topic")]
    public virtual ICollection<UserTopic> UserTopics { get; set; } = new List<UserTopic>();
}
