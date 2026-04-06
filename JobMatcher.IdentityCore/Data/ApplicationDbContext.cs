using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JobMatcher.IdentityCore.Entities;

namespace JobMatcher.IdentityCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Company>(b =>
            {
                b.HasKey(c => c.Id);
                b.Property(c => c.Name).IsRequired();
                b.Property(c => c.CreatedAt).HasDefaultValueSql("now()");
            });

            builder.Entity<ApplicationUser>(b =>
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
                b.Property(a => a.AppliedAt).HasDefaultValueSql("now()");
                b.HasOne(a => a.Job).WithMany(j => j.Applications).HasForeignKey(a => a.JobId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
