using Microsoft.EntityFrameworkCore;
using XtraWork.Entities;

namespace XtraWork.Repositories;

public class XtraWorkContext : DbContext
{
    public XtraWorkContext(DbContextOptions<XtraWorkContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Title> Titles { get; set; }
    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Username)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.FirstName)
                  .HasMaxLength(50);

            entity.Property(u => u.LastName)
                  .HasMaxLength(50);

            entity.Property(u => u.Role)
                  .HasMaxLength(20)
                  .HasDefaultValue("User");

            entity.HasIndex(u => u.Username)
                  .IsUnique();

            entity.HasIndex(u => u.Email)
                  .IsUnique();
        });

        // Configuration Title
        modelBuilder.Entity<Title>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Description)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(t => t.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");
        });

        // Configuration Employee
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FirstName)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.Property(e => e.LastName)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.Property(e => e.Gender)
                  .IsRequired()
                  .HasMaxLength(10);

            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            // Relation Employee -> Title
            entity.HasOne(e => e.Title)
                  .WithMany(t => t.Employees)
                  .HasForeignKey(e => e.TitleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}
