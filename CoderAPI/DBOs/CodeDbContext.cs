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

    public virtual DbSet<Bundle> Bundles { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseBundle> CourseBundles { get; set; }

    public virtual DbSet<CourseCategory> CourseCategories { get; set; }

    public virtual DbSet<CourseTopic> CourseTopics { get; set; }

    public virtual DbSet<Feature> Features { get; set; }

    public virtual DbSet<PlanFeature> PlanFeatures { get; set; }

    public virtual DbSet<Plann> Planns { get; set; }

    public virtual DbSet<Problem> Problems { get; set; }

    public virtual DbSet<ProblemDetail> ProblemDetails { get; set; }

    public virtual DbSet<ProblemTag> ProblemTags { get; set; }

    public virtual DbSet<QuizQuestion> QuizQuestions { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<TestCase> TestCases { get; set; }

    public virtual DbSet<Topic> Topics { get; set; }

    public virtual DbSet<TopicAsset> TopicAssets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBoard> UserBoards { get; set; }

    public virtual DbSet<UserCourse> UserCourses { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

    public virtual DbSet<UserPlan> UserPlans { get; set; }

    public virtual DbSet<UserProblemSession> UserProblemSessions { get; set; }

    public virtual DbSet<UserSessionChat> UserSessionChats { get; set; }

    public virtual DbSet<UserSolution> UserSolutions { get; set; }

    public virtual DbSet<UserTestCaseResult> UserTestCaseResults { get; set; }

    public virtual DbSet<UserTopic> UserTopics { get; set; }

    public virtual DbSet<UserTopicAsset> UserTopicAssets { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bundle>(entity =>
        {
            entity.HasKey(e => e.BundleId).HasName("PK__Bundle__4200345126A5CFA5");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0BE105BF17");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__Course__C92D71A77439DCC8");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<CourseBundle>(entity =>
        {
            entity.HasKey(e => e.CourseBundleId).HasName("PK__CourseBu__D0C7D2C928D5CBEB");

            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Bundle).WithMany(p => p.CourseBundles).HasConstraintName("FK__CourseBun__Bundl__3864608B");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseBundles).HasConstraintName("FK__CourseBun__Cours__395884C4");
        });

        modelBuilder.Entity<CourseCategory>(entity =>
        {
            entity.HasKey(e => e.CourseCategoryId).HasName("PK__CourseCa__4D67EBB6CAB09762");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Category).WithMany(p => p.CourseCategories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourseCat__Categ__489AC854");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseCategories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourseCat__Cours__47A6A41B");
        });

        modelBuilder.Entity<CourseTopic>(entity =>
        {
            entity.HasKey(e => e.CourseTopicId).HasName("PK__CourseTo__0E466DF38B705131");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Course).WithMany(p => p.CourseTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourseTop__Cours__778AC167");

            entity.HasOne(d => d.Topic).WithMany(p => p.CourseTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CourseTop__Topic__787EE5A0");
        });

        modelBuilder.Entity<Feature>(entity =>
        {
            entity.HasKey(e => e.FeatureId).HasName("PK__Feature__82230BC9342B82C9");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<PlanFeature>(entity =>
        {
            entity.HasKey(e => e.PlanFeatureId).HasName("PK__PlanFeat__4523949CA67E3D04");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Feature).WithMany(p => p.PlanFeatures)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlanFeatu__Featu__19DFD96B");

            entity.HasOne(d => d.Plan).WithMany(p => p.PlanFeatures)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PlanFeatu__PlanI__18EBB532");
        });

        modelBuilder.Entity<Plann>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__Plann__755C22B7368E6764");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Problem>(entity =>
        {
            entity.HasKey(e => e.ProblemId).HasName("PK__Problem__5CED528A45586B6C");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsLocked).HasDefaultValue(false);
        });

        modelBuilder.Entity<ProblemDetail>(entity =>
        {
            entity.HasKey(e => e.ProblemDetailId).HasName("PK__ProblemD__E0C3A6F511742332");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Problem).WithMany(p => p.ProblemDetails)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProblemDe__Probl__6FB49575");
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

        modelBuilder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__QuizQues__0DC06FAC98D01536");

            entity.HasOne(d => d.Asset).WithMany(p => p.QuizQuestions).HasConstraintName("FK__QuizQuest__Asset__3587F3E0");
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
        });

        modelBuilder.Entity<TopicAsset>(entity =>
        {
            entity.HasKey(e => e.TopicAssetId).HasName("PK__TopicAss__E61104BEAE1F00E3");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Topic).WithMany(p => p.TopicAssets).HasConstraintName("FK__TopicAsse__Topic__31B762FC");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C4B32AD15");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<UserBoard>(entity =>
        {
            entity.HasKey(e => e.UserBoardId).HasName("PK__UserBoar__EFC72B5768872A89");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdatedOn).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<UserCourse>(entity =>
        {
            entity.HasKey(e => e.UserCourseId).HasName("PK__UserCour__58886ED4C0868E6F");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ProgressStatus).HasDefaultValue("Not Started");
            entity.Property(e => e.PurchaseDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Course).WithMany(p => p.UserCourses)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserCourses_Course");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.UserDetailsId).HasName("PK__UserDeta__053A93A28B757DB3");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.User).WithMany(p => p.UserDetails)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserDetai__UserI__7755B73D");
        });

        modelBuilder.Entity<UserPlan>(entity =>
        {
            entity.HasKey(e => e.UserPlanId).HasName("PK__UserPlan__B2231FE1E6D0C83B");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.StartDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Plan).WithMany(p => p.UserPlans)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserPlan__PlanId__1EA48E88");
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

        modelBuilder.Entity<UserTopic>(entity =>
        {
            entity.HasKey(e => e.UserTopicId).HasName("PK__UserTopi__03A8C6901A1CAC15");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ProgressPercent).HasDefaultValue(0.00m);
            entity.Property(e => e.Status).HasDefaultValue("NotStarted");

            entity.HasOne(d => d.Topic).WithMany(p => p.UserTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserTopic_Topic");

            entity.HasOne(d => d.UserCourse).WithMany(p => p.UserTopics)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserTopic_UserCourse");
        });

        modelBuilder.Entity<UserTopicAsset>(entity =>
        {
            entity.HasKey(e => e.UserTopicAssetId).HasName("PK__UserTopi__B69B747665D4CC08");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.ProgressPercent).HasDefaultValue(0.00m);
            entity.Property(e => e.Status).HasDefaultValue("NotStarted");
            entity.Property(e => e.WatchedDurationInMinutes).HasDefaultValue(0);

            entity.HasOne(d => d.TopicAsset).WithMany(p => p.UserTopicAssets)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserTopicAsset_TopicAsset");

            entity.HasOne(d => d.UserTopic).WithMany(p => p.UserTopicAssets)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserTopicAsset_UserTopic");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
