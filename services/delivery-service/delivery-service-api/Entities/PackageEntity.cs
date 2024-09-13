using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using delivery_service_api.Enums;

namespace delivery_service_api.Entities;

[Table("packages")]
public class PackageEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("track_number")]
    public string TrackNumber { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("status")]
    public PackageStatus Status { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [Column("company_id")]
    public int CompanyId { get; set; }
    public CompanyEntity Company { get; set; }

    [Column("worker_id")]
    public int? WorkerId { get; set; }
    public WorkerEntity Worker { get; set; }
}
