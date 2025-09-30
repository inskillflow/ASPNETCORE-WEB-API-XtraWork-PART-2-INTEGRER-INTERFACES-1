using System.ComponentModel.DataAnnotations;

namespace XtraWork.Entities;

public class Title
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
