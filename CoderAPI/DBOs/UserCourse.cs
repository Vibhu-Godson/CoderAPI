using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

public partial class UserCourse
{
    [Key]
    public long UserCourseId { get; set; }

    public long UserId { get; set; }

    public long CourseId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PurchaseDate { get; set; }

    [StringLength(50)]
    public string? ProgressStatus { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("CourseId")]
    [InverseProperty("UserCourses")]
    public virtual Course Course { get; set; } = null!;

    [InverseProperty("UserCourse")]
    public virtual ICollection<UserSubTopic> UserSubTopics { get; set; } = new List<UserSubTopic>();
}
