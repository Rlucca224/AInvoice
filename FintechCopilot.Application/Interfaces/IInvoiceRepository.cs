using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Interfaces;

public interface IInvoiceRepository
{
    Task AddAsync(Invoice invoice);
    Task<List<Invoice>> GetAllAsync();
    Task<Invoice?> GetByIdAsync(Guid id);
    Task DeleteAsync(Invoice invoice);
}
