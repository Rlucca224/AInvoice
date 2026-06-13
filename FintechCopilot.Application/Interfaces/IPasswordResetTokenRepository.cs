using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Interfaces;

public interface IPasswordResetTokenRepository
{
    Task AddAsync(PasswordResetToken token);
    Task<PasswordResetToken?> GetByTokenAsync(string token);
    Task MarkAsUsedAsync(PasswordResetToken token);
}
