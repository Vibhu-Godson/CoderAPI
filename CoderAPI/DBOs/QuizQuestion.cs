using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

[Table("QuizQuestion")]
public partial class QuizQuestion
{
    [Key]
    public long QuestionId { get; set; }

    public string? QuestionText { get; set; }

    [StringLength(50)]
    public string? QuestionType { get; set; }

    public string? Options { get; set; }

    public string? CorrectAnswer { get; set; }

    public long? AssetId { get; set; }

    [ForeignKey("AssetId")]
    [InverseProperty("QuizQuestions")]
    public virtual TopicAsset? Asset { get; set; }
}
