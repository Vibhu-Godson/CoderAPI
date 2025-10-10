using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("TopicAsset")]
public partial class TopicAsset
{
    [Key]
    public long TopicAssetId { get; set; }

    public long? TopicId { get; set; }

    [StringLength(50)]
    public string? AssetType { get; set; }

    [StringLength(255)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? FileUrl { get; set; }

    public int? DurationInMinutes { get; set; }

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

    [InverseProperty("Asset")]
    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();

    [ForeignKey("TopicId")]
    [InverseProperty("TopicAssets")]
    public virtual Topic? Topic { get; set; }
}
