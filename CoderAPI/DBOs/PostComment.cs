using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("PostComment")]
public partial class PostComment
{
    [Key]
    public long PostCommentId { get; set; }

    public long PostId { get; set; }

    public long UserId { get; set; }

    public long? ParentCommentId { get; set; }

    public string Content { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("ParentComment")]
    public virtual ICollection<PostComment> InverseParentComment { get; set; } = new List<PostComment>();

    [ForeignKey("ParentCommentId")]
    [InverseProperty("InverseParentComment")]
    public virtual PostComment? ParentComment { get; set; }

    [ForeignKey("PostId")]
    [InverseProperty("PostComments")]
    public virtual Post Post { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("PostComments")]
    public virtual User User { get; set; } = null!;
}
