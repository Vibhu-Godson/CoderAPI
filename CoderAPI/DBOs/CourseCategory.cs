using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("CourseCategory")]
public partial class CourseCategory
{
    [Key]
    public int CourseCategoryId { get; set; }

    public long CourseId { get; set; }

    public int CategoryId { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(50)]
    public string? CreatedBy { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("CourseCategories")]
    public virtual Category Category { get; set; } = null!;

    [ForeignKey("CourseId")]
    [InverseProperty("CourseCategories")]
    public virtual Course Course { get; set; } = null!;
}
