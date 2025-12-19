using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Post")]
public partial class Post
{
    [Key]
    public long PostId { get; set; }

    public long UserId { get; set; }

    [StringLength(500)]
    public string? ShortText { get; set; }

    public string? LongText { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Post")]
    public virtual ICollection<PostComment> PostComments { get; set; } = new List<PostComment>();

    [InverseProperty("Post")]
    public virtual ICollection<PostHashtag> PostHashtags { get; set; } = new List<PostHashtag>();

    [InverseProperty("Post")]
    public virtual ICollection<PostMedium> PostMedia { get; set; } = new List<PostMedium>();

    [InverseProperty("Post")]
    public virtual ICollection<PostMention> PostMentions { get; set; } = new List<PostMention>();

    [InverseProperty("Post")]
    public virtual ICollection<PostReaction> PostReactions { get; set; } = new List<PostReaction>();

    [ForeignKey("UserId")]
    [InverseProperty("Posts")]
    public virtual User User { get; set; } = null!;

    [InverseProperty("Post")]
    public virtual ICollection<UserPostConsumption> UserPostConsumptions { get; set; } = new List<UserPostConsumption>();
}
