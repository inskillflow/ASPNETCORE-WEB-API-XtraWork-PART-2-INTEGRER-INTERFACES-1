using System.ComponentModel.DataAnnotations;

namespace XtraWork.Requests;

public class LoginRequest
{
    [Required(ErrorMessage = "Le nom d'utilisateur est obligatoire")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est obligatoire")]
    public string Password { get; set; } = string.Empty;
}
