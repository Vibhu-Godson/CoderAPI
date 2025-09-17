using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

public partial class UserNote
{
    [Key]
    public long UserNoteId { get; set; }

    public long UserId { get; set; }

    public long SubTopicId { get; set; }

    [StringLength(255)]
    public string AnchorReference { get; set; } = null!;

    [StringLength(2000)]
    public string? NoteContent { get; set; }

    public byte[]? BoardContent { get; set; }

    public bool? IsPopup { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime LastEditedOn { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("SubTopicId")]
    [InverseProperty("UserNotes")]
    public virtual SubTopic SubTopic { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserNotes")]
    public virtual User User { get; set; } = null!;
}
