using FintechCopilot.Application.DTOs;
using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Services;

public class MetricsService : IMetricsService
{
    public DashboardMetrics Calculate(List<Invoice> invoices)
    {
        var now = DateTime.UtcNow;
        var monthlyInvoices = invoices.Where(i =>
        {
            if (!DateTime.TryParse(i.Date, out var date)) return false;
            return date.Year == now.Year && date.Month == now.Month;
        }).ToList();

        return new DashboardMetrics
        {
            MonthlyTotal = monthlyInvoices.Sum(i => i.Total),
            TotalInvoices = invoices.Count,
            TotalGeneral = invoices.Sum(i => i.Total)
        };
    }
}
