using delivery_service_api.Entities;
using Microsoft.EntityFrameworkCore;

namespace delivery_service_api.Database;

public class DatabaseContext : DbContext
{
    public DbSet<CompanyEntity> Companies { get; set; }
    public DbSet<WorkerEntity> Workers { get; set; }
    public DbSet<PackageEntity> Packages { get; set; }

    public DatabaseContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PackageEntity>().HasIndex(e => e.TrackNumber).IsUnique();
    }
}
