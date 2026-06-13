using System.ComponentModel.DataAnnotations;

namespace FintechCopilot.Application.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "El nombre de empresa es obligatorio")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo electrónico es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de correo inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).{8,}$",
        ErrorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número")]
    public string Password { get; set; } = string.Empty;
}
