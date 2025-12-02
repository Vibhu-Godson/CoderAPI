using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("SettingDefinition")]
[Index("SettingKey", Name = "UQ__SettingD__01E719AD945186F2", IsUnique = true)]
public partial class SettingDefinition
{
    [Key]
    public int SettingId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string SettingKey { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Category { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string DataType { get; set; } = null!;

    [Column(TypeName = "text")]
    public string? DefaultValue { get; set; }

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    public string? Meta { get; set; }

    [InverseProperty("Setting")]
    public virtual ICollection<UserSetting> UserSettings { get; set; } = new List<UserSetting>();
}
