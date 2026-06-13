using FintechCopilot.Application.DTOs;
using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.Interfaces;

public interface IMetricsService
{
    DashboardMetrics Calculate(List<Invoice> invoices);
}
