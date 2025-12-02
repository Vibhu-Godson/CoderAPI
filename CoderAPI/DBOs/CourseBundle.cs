using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("CourseBundle")]
public partial class CourseBundle
{
    [Key]
    public long CourseBundleId { get; set; }

    public long? BundleId { get; set; }

    public long? CourseId { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    [ForeignKey("BundleId")]
    [InverseProperty("CourseBundles")]
    public virtual Bundle? Bundle { get; set; }

    [ForeignKey("CourseId")]
    [InverseProperty("CourseBundles")]
    public virtual Course? Course { get; set; }
}
