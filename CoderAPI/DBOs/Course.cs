using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("Course")]
public partial class Course
{
    [Key]
    public long CourseId { get; set; }

    [StringLength(200)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    public int? DurationInHours { get; set; }

    [StringLength(50)]
    public string? Level { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Course")]
    public virtual ICollection<CourseTopic> CourseTopics { get; set; } = new List<CourseTopic>();

    [InverseProperty("Course")]
    public virtual ICollection<UserCourse> UserCourses { get; set; } = new List<UserCourse>();
}
