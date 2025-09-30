using System.ComponentModel.DataAnnotations;

namespace XtraWork.Requests;

public class TitleRequest
{
    [Required(ErrorMessage = "La description est obligatoire")]
    [MaxLength(100, ErrorMessage = "La description ne peut pas dépasser 100 caractères")]
    public string Description { get; set; } = string.Empty;
}