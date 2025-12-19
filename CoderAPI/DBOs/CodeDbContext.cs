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

    public virtual DbSet<EventParticipant> EventParticipants { get; set; }

    public virtual DbSet<Feature> Features { get; set; }

    public virtual DbSet<Hashtag> Hashtags { get; set; }

    public virtual DbSet<MediaType> MediaTypes { get; set; }

    public virtual DbSet<OrgMember> OrgMembers { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<PlanFeature> PlanFeatures { get; set; }

    public virtual DbSet<Plann> Planns { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<PostComment> PostComments { get; set; }

    public virtual DbSet<PostHashtag> PostHashtags { get; set; }

    public virtual DbSet<PostMedium> PostMedia { get; set; }

    public virtual DbSet<PostMention> PostMentions { get; set; }

    public virtual DbSet<PostReaction> PostReactions { get; set; }

    public virtual DbSet<Problem> Problems { get; set; }

    public virtual DbSet<ProblemDetail> ProblemDetails { get; set; }

    public virtual DbSet<ProblemDiscussion> ProblemDiscussions { get; set; }

    public virtual DbSet<ProblemDiscussionReaction> ProblemDiscussionReactions { get; set; }

    public virtual DbSet<ProblemDiscussionTag> ProblemDiscussionTags { get; set; }

    public virtual DbSet<ProblemDiscussionView> ProblemDiscussionViews { get; set; }

    public virtual DbSet<ProblemTag> ProblemTags { get; set; }

    public virtual DbSet<QuizQuestion> QuizQuestions { get; set; }

    public virtual DbSet<SettingDefinition> SettingDefinitions { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<TestCase> TestCases { get; set; }

    public virtual DbSet<Topic> Topics { get; set; }

    public virtual DbSet<TopicAsset> TopicAssets { get; set; }

    public virtual DbSet<Tribe> Tribes { get; set; }

    public virtual DbSet<TribeActivity> TribeActivities { get; set; }

    public virtual DbSet<TribeActivityEntityMaster> TribeActivityEntityMasters { get; set; }

    public virtual DbSet<TribeGoalMap> TribeGoalMaps { get; set; }

    public virtual DbSet<TribeGoalMaster> TribeGoalMasters { get; set; }

    public virtual DbSet<TribeMember> TribeMembers { get; set; }

    public virtual DbSet<TribeMemberRoleMaster> TribeMemberRoleMasters { get; set; }

    public virtual DbSet<TribeRoleResponsibilityMaster> TribeRoleResponsibilityMasters { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBoard> UserBoards { get; set; }

    public virtual DbSet<UserCourse> UserCourses { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

    public virtual DbSet<UserFeedback> UserFeedbacks { get; set; }

    public virtual DbSet<UserPlan> UserPlans { get; set; }

    public virtual DbSet<UserPostConsumption> UserPostConsumptions { get; set; }

    public virtual DbSet<UserProblemSession> UserProblemSessions { get; set; }

    public virtual DbSet<UserSessionChat> UserSessionChats { get; set; }

    public virtual DbSet<UserSetting> UserSettings { get; set; }

    public virtual DbSet<UserSolution> UserSolutions { get; set; }

    public virtual DbSet<UserTestCaseResult> UserTestCaseResults { get; set; }

    public virtual DbSet<UserTopic> UserTopics { get; set; }

    public virtual DbSet<UserTopicAsset> UserTopicAssets { get; set; }

    public virtual DbSet<Workshop> Workshops { get; set; }

    public virtual DbSet<WorkshopEvent> WorkshopEvents { get; set; }

    public virtual DbSet<WorkshopGoalMap> WorkshopGoalMaps { get; set; }

    public virtual DbSet<WorkshopGoalMaster> WorkshopGoalMasters { get; set; }

    
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

        modelBuilder.Entity<EventParticipant>(entity =>
        {
            entity.HasKey(e => e.EventParticipantId).HasName("PK__EventPar__09F32B92590A1557");

            entity.HasOne(d => d.Tribe).WithMany(p => p.EventParticipants).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.EventParticipants)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EventParticipant_Users_UserId");

            entity.HasOne(d => d.WorkshopEvent).WithMany(p => p.EventParticipants).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Feature>(entity =>
        {
            entity.HasKey(e => e.FeatureId).HasName("PK__Feature__82230BC9342B82C9");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Hashtag>(entity =>
        {
            entity.HasKey(e => e.HashtagId).HasName("PK__Hashtag__BEFA912A195E2C9C");
        });

        modelBuilder.Entity<MediaType>(entity =>
        {
            entity.HasKey(e => e.MediaTypeId).HasName("PK__MediaTyp__0E6FCB7279C5D440");
        });

        modelBuilder.Entity<OrgMember>(entity =>
        {
            entity.HasKey(e => e.OrgMemberId).HasName("PK__OrgMembe__4F847F0BA8167483");

            entity.HasOne(d => d.Organization).WithMany(p => p.OrgMembers).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.OrganizationId).HasName("PK__Organiza__CADB0B12A5A98D09");
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

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Post__AA126018F48C22B6");

            entity.HasOne(d => d.User).WithMany(p => p.Posts)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Post_Users_UserId");
        });

        modelBuilder.Entity<PostComment>(entity =>
        {
            entity.HasKey(e => e.PostCommentId).HasName("PK__PostComm__A955AFED072D6F63");

            entity.HasOne(d => d.Post).WithMany(p => p.PostComments).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.PostComments)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostComment_Users_UserId");
        });

        modelBuilder.Entity<PostHashtag>(entity =>
        {
            entity.HasKey(e => e.PostHashtagId).HasName("PK__PostHash__A68E12D14CE95E40");

            entity.HasOne(d => d.Hashtag).WithMany(p => p.PostHashtags).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Post).WithMany(p => p.PostHashtags).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PostMedium>(entity =>
        {
            entity.HasKey(e => e.PostMediaId).HasName("PK__PostMedi__75C231348F553D3F");

            entity.HasOne(d => d.MediaType).WithMany(p => p.PostMedia).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Post).WithMany(p => p.PostMedia).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PostMention>(entity =>
        {
            entity.HasKey(e => e.PostMentionId).HasName("PK__PostMent__D67CFA3D7FF52B7D");

            entity.HasOne(d => d.MentionedByUser).WithMany(p => p.PostMentionMentionedByUsers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostMention_Users_MentionedByUserId");

            entity.HasOne(d => d.MentionedUser).WithMany(p => p.PostMentionMentionedUsers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostMention_Users_MentionedUserId");

            entity.HasOne(d => d.Post).WithMany(p => p.PostMentions).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<PostReaction>(entity =>
        {
            entity.HasKey(e => e.PostReactionId).HasName("PK__PostReac__CD046ABB63CB3740");

            entity.HasOne(d => d.Post).WithMany(p => p.PostReactions).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.PostReactions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostReaction_Users_UserId");
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

        modelBuilder.Entity<ProblemDiscussion>(entity =>
        {
            entity.HasKey(e => e.ProblemDiscussionId).HasName("PK__ProblemD__2439338D175E96DB");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DiscussionTitle).HasDefaultValue("");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.ParentDiscussion).WithMany(p => p.InverseParentDiscussion).HasConstraintName("FK_ProblemDiscussion_Parent");

            entity.HasOne(d => d.User).WithMany(p => p.ProblemDiscussions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProblemDiscussion_User");

            entity.HasOne(d => d.UserProblemSession).WithMany(p => p.ProblemDiscussions).HasConstraintName("FK_ProblemDiscussion_UserProblemSession");

            entity.HasOne(d => d.UserSolution).WithMany(p => p.ProblemDiscussions).HasConstraintName("FK_ProblemDiscussion_UserSolution");
        });

        modelBuilder.Entity<ProblemDiscussionReaction>(entity =>
        {
            entity.HasKey(e => e.ReactionId).HasName("PK__Discussi__46DDF9B481A698B6");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.ProblemDiscussion).WithMany(p => p.ProblemDiscussionReactions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reaction_ProblemDiscussion");

            entity.HasOne(d => d.User).WithMany(p => p.ProblemDiscussionReactions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reaction_User");
        });

        modelBuilder.Entity<ProblemDiscussionTag>(entity =>
        {
            entity.HasKey(e => e.ProblemDiscussionTagId).HasName("PK__ProblemD__04DD4AFBE6999DE1");

            entity.HasOne(d => d.ProblemDiscussion).WithMany(p => p.ProblemDiscussionTags)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProblemDi__Probl__3DE82FB7");

            entity.HasOne(d => d.User).WithMany(p => p.ProblemDiscussionTags)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProblemDi__UserI__3CF40B7E");
        });

        modelBuilder.Entity<ProblemDiscussionView>(entity =>
        {
            entity.HasKey(e => e.ProblemDiscussionViewId).HasName("PK__ProblemD__AB8740D001CAECB5");

            entity.Property(e => e.ViewedOn).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.ProblemDiscussion).WithMany(p => p.ProblemDiscussionViews)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiscussionView_ProblemDiscussion");

            entity.HasOne(d => d.User).WithMany(p => p.ProblemDiscussionViews)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DiscussionView_User");
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

        modelBuilder.Entity<SettingDefinition>(entity =>
        {
            entity.HasKey(e => e.SettingId).HasName("PK__SettingD__54372B1DCB1ED7AF");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
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

        modelBuilder.Entity<Tribe>(entity =>
        {
            entity.HasKey(e => e.TribeId).HasName("PK__Tribe__FE5FA43B7EF53A6B");

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.Tribes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tribe_Users_OwnerUserId");
        });

        modelBuilder.Entity<TribeActivity>(entity =>
        {
            entity.HasKey(e => e.TribeActivityId).HasName("PK__TribeAct__5164AB4226DB14D5");

            entity.HasOne(d => d.TribeActivityEntityMaster).WithMany(p => p.TribeActivities).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Tribe).WithMany(p => p.TribeActivities).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.TribeActivities)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TribeActivity_Users_UserId");
        });

        modelBuilder.Entity<TribeActivityEntityMaster>(entity =>
        {
            entity.HasKey(e => e.TribeActivityEntityMasterId).HasName("PK__TribeAct__5D659893F1BB0BDD");
        });

        modelBuilder.Entity<TribeGoalMap>(entity =>
        {
            entity.HasKey(e => e.TribeGoalMapId).HasName("PK__TribeGoa__AE5A07AF116A76E2");

            entity.HasOne(d => d.TribeGoalMaster).WithMany(p => p.TribeGoalMaps).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Tribe).WithMany(p => p.TribeGoalMaps).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TribeGoalMaster>(entity =>
        {
            entity.HasKey(e => e.TribeGoalMasterId).HasName("PK__TribeGoa__6ED81FE75D9043C6");
        });

        modelBuilder.Entity<TribeMember>(entity =>
        {
            entity.HasKey(e => e.TribeMemberId).HasName("PK__TribeMem__F3BF6C02A7032430");

            entity.HasOne(d => d.Tribe).WithMany(p => p.TribeMembers).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.TribeMemberRoleMaster).WithMany(p => p.TribeMembers).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.TribeMembers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TribeMember_Users_UserId");
        });

        modelBuilder.Entity<TribeMemberRoleMaster>(entity =>
        {
            entity.HasKey(e => e.TribeMemberRoleMasterId).HasName("PK__TribeMem__E8F7C83047995CE7");
        });

        modelBuilder.Entity<TribeRoleResponsibilityMaster>(entity =>
        {
            entity.HasKey(e => e.TribeRoleResponsibilityMasterId).HasName("PK__TribeRol__8C9ED0FB43B9D3E8");

            entity.HasOne(d => d.TribeMemberRoleMaster).WithMany(p => p.TribeRoleResponsibilityMasters).OnDelete(DeleteBehavior.ClientSetNull);
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

        modelBuilder.Entity<UserFeedback>(entity =>
        {
            entity.HasKey(e => e.UserFeedbackId).HasName("PK__UserFeed__4E2DB6D742E558E8");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Status).HasDefaultValue("PENDING");

            entity.HasOne(d => d.User).WithMany(p => p.UserFeedbacks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserFeedb__UserI__7C1A6C5A");
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

        modelBuilder.Entity<UserPostConsumption>(entity =>
        {
            entity.HasKey(e => e.UserPostConsumptionId).HasName("PK__UserPost__4389F92E53EDF4CB");

            entity.HasOne(d => d.Post).WithMany(p => p.UserPostConsumptions).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.UserPostConsumptions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserPostConsumption_Users_UserId");
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

        modelBuilder.Entity<UserSetting>(entity =>
        {
            entity.HasKey(e => e.UserSettingId).HasName("PK__UserSett__C40DB7FF163FDF55");

            entity.Property(e => e.CreatedOn).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            entity.HasOne(d => d.Setting).WithMany(p => p.UserSettings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSetti__Updat__0880433F");
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

        modelBuilder.Entity<Workshop>(entity =>
        {
            entity.HasKey(e => e.WorkshopId).HasName("PK__Workshop__7A008C0A14DEBAC8");

            entity.HasOne(d => d.OrganizedBy).WithMany(p => p.WorkshopOrganizedBies).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<WorkshopEvent>(entity =>
        {
            entity.HasKey(e => e.WorkshopEventId).HasName("PK__Workshop__62FC654EB20B80D8");

            entity.HasOne(d => d.Workshop).WithMany(p => p.WorkshopEvents).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<WorkshopGoalMap>(entity =>
        {
            entity.HasKey(e => e.WorkshopGoalMapId).HasName("PK__Workshop__36AD21E00B9FC15A");

            entity.HasOne(d => d.WorkshopGoalMaster).WithMany(p => p.WorkshopGoalMaps).OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Workshop).WithMany(p => p.WorkshopGoalMaps).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<WorkshopGoalMaster>(entity =>
        {
            entity.HasKey(e => e.WorkshopGoalMasterId).HasName("PK__Workshop__5A08F92629F7FCF1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
