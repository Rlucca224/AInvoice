using System.ComponentModel.DataAnnotations;

namespace FintechCopilot.Application.DTOs;

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "El código es obligatorio")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).{8,}$",
        ErrorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número")]
    public string NewPassword { get; set; } = string.Empty;
}
