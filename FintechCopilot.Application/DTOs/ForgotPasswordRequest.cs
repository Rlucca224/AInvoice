using System.ComponentModel.DataAnnotations;

namespace FintechCopilot.Application.DTOs;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "El correo electrónico es obligatorio")]
    [EmailAddress(ErrorMessage = "Formato de correo inválido")]
    public string Email { get; set; } = string.Empty;
}
