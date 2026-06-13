using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FintechCopilot.Infrastructure.Data;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly AppDbContext _context;

    public InvoiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Invoice invoice)
    {
        await _context.Invoices.AddAsync(invoice);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Invoice>> GetAllAsync()
    {
        return await _context.Invoices.OrderByDescending(i => i.CreatedAt).ToListAsync();
    }

    public async Task<Invoice?> GetByIdAsync(Guid id)
    {
        return await _context.Invoices.FindAsync(id);
    }

    public async Task DeleteAsync(Invoice invoice)
    {
        _context.Invoices.Remove(invoice);
        await _context.SaveChangesAsync();
    }
}
