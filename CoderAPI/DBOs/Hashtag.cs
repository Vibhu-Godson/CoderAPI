using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Hashtag")]
public partial class Hashtag
{
    [Key]
    public long HashtagId { get; set; }

    [StringLength(100)]
    public string TagName { get; set; } = null!;

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("Hashtag")]
    public virtual ICollection<PostHashtag> PostHashtags { get; set; } = new List<PostHashtag>();
}
