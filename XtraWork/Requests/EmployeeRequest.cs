using System.ComponentModel.DataAnnotations;

namespace XtraWork.Requests;

public class EmployeeRequest
{
    [Required(ErrorMessage = "Le prénom est obligatoire")]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est obligatoire")]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La date de naissance est obligatoire")]
    public DateTime BirthDate { get; set; }

    [Required(ErrorMessage = "Le genre est obligatoire")]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le titre est obligatoire")]
    public Guid TitleId { get; set; }
}
