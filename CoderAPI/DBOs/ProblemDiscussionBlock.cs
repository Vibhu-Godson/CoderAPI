using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("ProblemDiscussionBlock")]
public partial class ProblemDiscussionBlock
{
    [Key]
    public long BlockId { get; set; }

    public long ProblemDiscussionId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string BlockType { get; set; } = null!;

    public int SortOrder { get; set; }

    [StringLength(1000)]
    public string? ShortTextContent { get; set; }

    public string? BigTextContent { get; set; }

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public bool IsEdited { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("ProblemDiscussionId")]
    [InverseProperty("ProblemDiscussionBlocks")]
    public virtual ProblemDiscussion ProblemDiscussion { get; set; } = null!;
}
