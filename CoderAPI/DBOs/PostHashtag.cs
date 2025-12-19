using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("PostHashtag")]
[Index("PostId", "HashtagId", Name = "UQ_PostHashtag_PostId_HashtagId", IsUnique = true)]
public partial class PostHashtag
{
    [Key]
    public long PostHashtagId { get; set; }

    public long PostId { get; set; }

    public long HashtagId { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("HashtagId")]
    [InverseProperty("PostHashtags")]
    public virtual Hashtag Hashtag { get; set; } = null!;

    [ForeignKey("PostId")]
    [InverseProperty("PostHashtags")]
    public virtual Post Post { get; set; } = null!;
}
