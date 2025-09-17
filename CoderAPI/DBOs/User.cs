using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Index("FacebookId", Name = "UQ__Users__4D656465EFF09EC5", IsUnique = true)]
[Index("PhoneNumber", Name = "UQ__Users__85FB4E38E5BD99EC", IsUnique = true)]
[Index("GoogleId", Name = "UQ__Users__A6FBF2FB33310730", IsUnique = true)]
[Index("Email", Name = "UQ__Users__A9D10534A490BA55", IsUnique = true)]
public partial class User
{
    [Key]
    public long UserId { get; set; }

    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(15)]
    public string? PhoneNumber { get; set; }

    [StringLength(255)]
    public string? GoogleId { get; set; }

    [StringLength(255)]
    public string? FacebookId { get; set; }

    [StringLength(255)]
    public string? LoginPassword { get; set; }

    public byte[]? ProfileImage { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? TimeZone { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long? UpdatedBy { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<UserNote> UserNotes { get; set; } = new List<UserNote>();

    [InverseProperty("User")]
    public virtual ICollection<UserProblemSession> UserProblemSessions { get; set; } = new List<UserProblemSession>();

    [InverseProperty("User")]
    public virtual ICollection<UserSolution> UserSolutions { get; set; } = new List<UserSolution>();

    [InverseProperty("User")]
    public virtual ICollection<UserSubTopic> UserSubTopics { get; set; } = new List<UserSubTopic>();
}
