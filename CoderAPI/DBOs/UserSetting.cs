using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserSetting")]
public partial class UserSetting
{
    [Key]
    public int UserSettingId { get; set; }

    public int UserId { get; set; }

    public int SettingId { get; set; }

    [Column(TypeName = "text")]
    public string? Value { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [ForeignKey("SettingId")]
    [InverseProperty("UserSettings")]
    public virtual SettingDefinition Setting { get; set; } = null!;
}
