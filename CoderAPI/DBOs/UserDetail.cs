using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

public partial class UserDetail
{
    [Key]
    public long UserDetailsId { get; set; }

    public long UserId { get; set; }

    [StringLength(1200)]
    public string? LatestExperience { get; set; }

    [StringLength(1200)]
    public string? LatestEducation { get; set; }

    [StringLength(800)]
    public string? LatestProject { get; set; }

    [StringLength(1000)]
    public string? Skills { get; set; }

    [StringLength(1000)]
    public string? Motivation { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [StringLength(100)]
    public string? CurrentRole { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserDetails")]
    public virtual User User { get; set; } = null!;
}
