using System.Security.Cryptography;
using FintechCopilot.Application.DTOs;
using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordResetTokenRepository _resetTokenRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(IUserRepository userRepository, IPasswordResetTokenRepository resetTokenRepository, IJwtService jwtService, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _resetTokenRepository = resetTokenRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser is not null)
            throw new InvalidOperationException("Este correo ya está registrado, intenta iniciar sesión");

        var user = new User
        {
            CompanyName = request.CompanyName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        return new AuthResponse
        {
            Token = _jwtService.GenerateToken(user),
            CompanyName = user.CompanyName,
            Email = user.Email
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user is null || !user.IsActive)
            throw new UnauthorizedAccessException("Credenciales inválidas. Por favor, intenta de nuevo");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Credenciales inválidas. Por favor, intenta de nuevo");

        return new AuthResponse
        {
            Token = _jwtService.GenerateToken(user),
            CompanyName = user.CompanyName,
            Email = user.Email
        };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user is null)
            throw new InvalidOperationException("Si el correo está registrado, recibirás un código de recuperación");

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)).Replace("+", "-").Replace("/", "_").Substring(0, 32);

        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            IsUsed = false
        };

        await _resetTokenRepository.AddAsync(resetToken);

        Console.WriteLine($"[PASSWORD RESET] Código para {request.Email}: {token}");
        Console.WriteLine($"[PASSWORD RESET] Válido por 15 minutos");
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var resetToken = await _resetTokenRepository.GetByTokenAsync(request.Token);

        if (resetToken is null)
            throw new InvalidOperationException("Código inválido o ya utilizado");

        if (resetToken.ExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException("El código ha expirado. Solicita uno nuevo");

        var user = await _userRepository.GetByIdAsync(resetToken.UserId);
        if (user is null)
            throw new InvalidOperationException("Usuario no encontrado");

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        await _userRepository.UpdateAsync(user);

        await _resetTokenRepository.MarkAsUsedAsync(resetToken);
    }
}
