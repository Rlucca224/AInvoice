using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
