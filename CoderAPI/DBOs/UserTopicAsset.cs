using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserTopicAsset")]
[Index("UserTopicId", "TopicAssetId", Name = "UQ_UserTopicAsset", IsUnique = true)]
public partial class UserTopicAsset
{
    [Key]
    public long UserTopicAssetId { get; set; }

    public long UserTopicId { get; set; }

    public long TopicAssetId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string Status { get; set; } = null!;

    public int? WatchedDurationInMinutes { get; set; }

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

    [StringLength(500)]
    public string? JsonInfo { get; set; }

    [ForeignKey("TopicAssetId")]
    [InverseProperty("UserTopicAssets")]
    public virtual TopicAsset TopicAsset { get; set; } = null!;

    [ForeignKey("UserTopicId")]
    [InverseProperty("UserTopicAssets")]
    public virtual UserTopic UserTopic { get; set; } = null!;
}
