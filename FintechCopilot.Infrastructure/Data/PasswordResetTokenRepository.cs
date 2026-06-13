using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FintechCopilot.Infrastructure.Data;

public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly AppDbContext _context;

    public PasswordResetTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(PasswordResetToken token)
    {
        await _context.PasswordResetTokens.AddAsync(token);
        await _context.SaveChangesAsync();
    }

    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.Token == token && !t.IsUsed);
    }

    public async Task MarkAsUsedAsync(PasswordResetToken token)
    {
        token.IsUsed = true;
        await _context.SaveChangesAsync();
    }
}
