using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JobMatcher.IdentityCore.Entities;

namespace JobMatcher.IdentityCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<EmbeddingStorage> EmbeddingStorages { get; set; } = null!;
        public DbSet<Candidate> Candidates { get; set; } = null!;
        public DbSet<Skill> Skills { get; set; } = null!;
        public DbSet<CandidateSkill> CandidateSkills { get; set; } = null!;
        public DbSet<WorkExperience> WorkExperiences { get; set; } = null!;
        public DbSet<Education> Educations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Company>(b =>
            {
                b.HasKey(c => c.Id);
                b.Property(c => c.Name).IsRequired();
                b.Property(c => c.CreatedAt).HasDefaultValueSql("now()");
            });

            builder.Entity<AppUser>(b =>
            {
                b.Property(u => u.FullName).HasMaxLength(256);
                b.HasOne<Company>().WithMany().HasForeignKey(u => u.CompanyId).OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<Job>(b =>
            {
                b.HasKey(j => j.Id);
                b.Property(j => j.Title).IsRequired().HasMaxLength(256);
                b.Property(j => j.Description).IsRequired();
                b.Property(j => j.Requirements).HasMaxLength(2000);
                b.Property(j => j.Location).HasMaxLength(256);
                b.Property(j => j.SalaryRange).HasMaxLength(128);
                b.Property(j => j.EmploymentType).HasMaxLength(64);
                b.Property(j => j.Status).HasDefaultValue(JobStatus.Draft);
                b.Property(j => j.CreatedAt).HasDefaultValueSql("now()");
                b.HasOne(j => j.Company).WithMany().HasForeignKey(j => j.CompanyId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Application>(b =>
            {
                b.HasKey(a => a.Id);
                b.Property(a => a.MatchScore).HasDefaultValue(0.0);
                b.Property(a => a.Status).HasConversion<string>().HasDefaultValue(ApplicationStatus.Pending);
                b.Property(a => a.AppliedAt).HasDefaultValueSql("now()");
                b.HasOne(a => a.Job).WithMany(j => j.Applications).HasForeignKey(a => a.JobId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(a => a.Candidate).WithMany(c => c.Applications).HasForeignKey(a => a.CandidateId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<EmbeddingStorage>(b =>
            {
                b.HasKey(e => e.Id);
                b.Property(e => e.EntityType).IsRequired().HasMaxLength(50);
                b.Property(e => e.EntityId).IsRequired();
                b.Property(e => e.Vector).IsRequired();
                b.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                b.HasIndex(e => new { e.EntityType, e.EntityId }).IsUnique();
            });

            // Candidates
            builder.Entity<Candidate>(b =>
            {
                b.HasKey(c => c.Id);
                b.Property(c => c.FullName).IsRequired().HasMaxLength(256);
                b.Property(c => c.Email).HasMaxLength(256);
                b.Property(c => c.Phone).HasMaxLength(64);
                b.Property(c => c.CreatedAt).HasDefaultValueSql("now()");
            });

            builder.Entity<Skill>(b =>
            {
                b.HasKey(s => s.Id);
                b.Property(s => s.Name).IsRequired().HasMaxLength(128);
                b.HasIndex(s => s.Name).IsUnique();
            });

            builder.Entity<CandidateSkill>(b =>
            {
                b.HasKey(cs => new { cs.CandidateId, cs.SkillId });
                b.HasOne(cs => cs.Candidate).WithMany(c => c.CandidateSkills).HasForeignKey(cs => cs.CandidateId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(cs => cs.Skill).WithMany(s => s.CandidateSkills).HasForeignKey(cs => cs.SkillId).OnDelete(DeleteBehavior.Cascade);
                b.Property(cs => cs.Level).IsRequired();
            });

            builder.Entity<WorkExperience>(b =>
            {
                b.HasKey(w => w.Id);
                b.Property(w => w.CompanyName).IsRequired();
                b.Property(w => w.Role).IsRequired();
                b.HasOne(w => w.Candidate).WithMany(c => c.WorkExperiences).HasForeignKey(w => w.CandidateId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Education>(b =>
            {
                b.HasKey(e => e.Id);
                b.Property(e => e.Institution).IsRequired();
                b.Property(e => e.Degree).IsRequired();
                b.HasOne(e => e.Candidate).WithMany(c => c.Educations).HasForeignKey(e => e.CandidateId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
