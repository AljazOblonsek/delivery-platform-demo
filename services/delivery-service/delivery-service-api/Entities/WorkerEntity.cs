using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace delivery_service_api.Entities;

[Table("workers")]
public class WorkerEntity
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("firstname")]
    public string Firstname { get; set; }

    [Column("lastname")]
    public string Lastname { get; set; }

    [Column("email")]
    public string Email { get; set; }

    [Column("hashed_password")]
    public string HashedPassword { get; set; }

    [Column("company_id")]
    public int CompanyId { get; set; }
    public CompanyEntity Company { get; set; }

    public ICollection<PackageEntity> Packages { get; set; }
}
