using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace delivery_service_api.Entities;

[Table("companies")]
public class CompanyEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }
    public ICollection<WorkerEntity> Workers { get; set; }
    public ICollection<PackageEntity> Packages { get; set; }
}
