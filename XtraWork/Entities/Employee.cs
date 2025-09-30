using System.ComponentModel.DataAnnotations;

namespace XtraWork.Entities;

public class Employee
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime BirthDate { get; set; }

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public Guid TitleId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Title Title { get; set; } = null!;
}
