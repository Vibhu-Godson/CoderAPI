using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("SubTopic")]
public partial class SubTopic
{
    [Key]
    public long SubTopicId { get; set; }

    public long TopicId { get; set; }

    [StringLength(255)]
    public string SubTopicName { get; set; } = null!;

    public string? SubTopicContent { get; set; }

    [StringLength(500)]
    public string? YouTubeUrl { get; set; }

    public int? SortOrder { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [StringLength(50)]
    public string? ContentType { get; set; }

    [InverseProperty("SubTopic")]
    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();

    [ForeignKey("TopicId")]
    [InverseProperty("SubTopics")]
    public virtual Topic Topic { get; set; } = null!;

    [InverseProperty("SubTopic")]
    public virtual ICollection<UserNote> UserNotes { get; set; } = new List<UserNote>();

    [InverseProperty("SubTopic")]
    public virtual ICollection<UserSubTopic> UserSubTopics { get; set; } = new List<UserSubTopic>();
}
