using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("UserBoard")]
public partial class UserBoard
{
    [Key]
    public long UserBoardId { get; set; }

    public long ProblemId { get; set; }

    public long UserProblemSessionId { get; set; }

    public string? Content { get; set; }

    public bool IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    public long CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    public long UpdatedBy { get; set; }
}
