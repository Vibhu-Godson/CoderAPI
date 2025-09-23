using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CoderAPI.DBOs;

public partial class CodeDbContext : DbContext
{
    public CodeDbContext()
    {
    }

    public CodeDbContext(DbContextOptions<CodeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<LearningStage> LearningStages { get; set; }

    public virtual DbSet<Problem> Problems { get; set; }

    public virtual DbSet<ProblemTag> ProblemTags { get; set; }

    public virtual DbSet<SubTopic> SubTopics { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<TestCase> TestCases { get; set; }

    public virtual DbSet<Topic> Topics { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserNote> UserNotes { get; set; }

    public virtual DbSet<UserProblemSession> UserProblemSessions { get; set; }

    public virtual DbSet<UserSessionChat> UserSessionChats { get; set; }

    public virtual DbSet<UserSolution> UserSolutions { get; set; }

    public virtual DbSet<UserSubTopic> UserSubTopics { get; set; }

    public virtual DbSet<UserTestCaseResult> UserTestCaseResults { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LearningStage>(entity =>
        {
            entity.HasKey(e => e.LearningStageId).HasName("PK__Learning__49320B573F39258D");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Problem>(entity =>
        {
            entity.HasKey(e => e.ProblemId).HasName("PK__Problem__5CED528A45586B6C");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<ProblemTag>(entity =>
        {
            entity.HasKey(e => e.ProblemTagId).HasName("PK__ProblemT__523EAD33480510AC");

            entity.HasOne(d => d.Problem).WithMany(p => p.ProblemTags)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProblemTa__Probl__6754599E");

            entity.HasOne(d => d.Tag).WithMany(p => p.ProblemTags)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProblemTa__TagId__66603565");
        });

        modelBuilder.Entity<SubTopic>(entity =>
        {
            entity.HasKey(e => e.SubTopicId).HasName("PK__SubTopic__3EFE32D0DC4BDC3C");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Topic).WithMany(p => p.SubTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SubTopic__TopicI__31EC6D26");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK__Tag__657CF9ACFD7D3E64");
        });

        modelBuilder.Entity<TestCase>(entity =>
        {
            entity.HasKey(e => e.TestCaseId).HasName("PK__TestCase__D2074A94DB4C3C4C");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsEdgeCase).HasDefaultValue(false);
            entity.Property(e => e.IsHidden).HasDefaultValue(false);

            entity.HasOne(d => d.Problem).WithMany(p => p.TestCases)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestCase__Proble__47DBAE45");
        });

        modelBuilder.Entity<Topic>(entity =>
        {
            entity.HasKey(e => e.TopicId).HasName("PK__Topic__022E0F5D49BEDAEA");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.LearningStage).WithMany(p => p.Topics).HasConstraintName("FK__Topic__LearningS__2E1BDC42");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C4B32AD15");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<UserNote>(entity =>
        {
            entity.HasKey(e => e.UserNoteId).HasName("PK__UserNote__6E0C06ACD7D98527");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsPopup).HasDefaultValue(false);

            entity.HasOne(d => d.SubTopic).WithMany(p => p.UserNotes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserNotes__SubTo__3B75D760");

            entity.HasOne(d => d.User).WithMany(p => p.UserNotes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserNotes__UserI__3A81B327");
        });

        modelBuilder.Entity<UserProblemSession>(entity =>
        {
            entity.HasKey(e => e.UserProblemSessionId).HasName("PK__UserProb__B3C3B5E3674D5DE4");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SessionStatus).HasDefaultValue("Active");

            entity.HasOne(d => d.Problem).WithMany(p => p.UserProblemSessions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserProbl__Probl__4E88ABD4");

            entity.HasOne(d => d.User).WithMany(p => p.UserProblemSessions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserProbl__UserI__4D94879B");
        });

        modelBuilder.Entity<UserSessionChat>(entity =>
        {
            entity.HasKey(e => e.UserSessionChatId).HasName("PK__UserSess__B55156708134883E");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MessageType).HasDefaultValue("User");

            entity.HasOne(d => d.UserProblemSession).WithMany(p => p.UserSessionChats)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSessi__UserP__534D60F1");
        });

        modelBuilder.Entity<UserSolution>(entity =>
        {
            entity.HasKey(e => e.UserSolutionId).HasName("PK__UserSolu__30B846D287099341");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Problem).WithMany(p => p.UserSolutions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSolut__Probl__59FA5E80");

            entity.HasOne(d => d.User).WithMany(p => p.UserSolutions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSolut__UserI__59063A47");

            entity.HasOne(d => d.UserProblemSession).WithMany(p => p.UserSolutions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSolut__UserP__5812160E");
        });

        modelBuilder.Entity<UserSubTopic>(entity =>
        {
            entity.HasKey(e => e.UserSubTopicId).HasName("PK__UserSubT__1B8876289ABB20BE");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.SubTopic).WithMany(p => p.UserSubTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSubTo__SubTo__36B12243");

            entity.HasOne(d => d.User).WithMany(p => p.UserSubTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSubTo__UserI__35BCFE0A");
        });

        modelBuilder.Entity<UserTestCaseResult>(entity =>
        {
            entity.HasKey(e => e.UserTestCaseResultId).HasName("PK__UserTest__CE18B7E11D94368A");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.TestCase).WithMany(p => p.UserTestCaseResults)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserTestC__TestC__60A75C0F");

            entity.HasOne(d => d.UserSolution).WithMany(p => p.UserTestCaseResults)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserTestC__UserS__5FB337D6");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
