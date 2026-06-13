using FintechCopilot.Application.Services;
using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Tests;

public class MetricsServiceTests
{
    [Fact]
    public void Calculate_WithThreeValidInvoicesThisMonth_ReturnsCorrectTotalAndCount()
    {
        var now = DateTime.UtcNow;
        var invoices = new List<Invoice>
        {
            new() { Total = 50, Date = now.ToString("yyyy-MM-dd") },
            new() { Total = 30, Date = now.ToString("yyyy-MM-dd") },
            new() { Total = 20, Date = now.ToString("yyyy-MM-dd") }
        };

        var service = new MetricsService();
        var result = service.Calculate(invoices);

        Assert.Equal(100, result.MonthlyTotal);
        Assert.Equal(3, result.TotalInvoices);
        Assert.Equal(100, result.TotalGeneral);
    }

    [Fact]
    public void Calculate_WithInvoicesFromDifferentMonths_OnlyCountsCurrentMonth()
    {
        var now = DateTime.UtcNow;
        var invoices = new List<Invoice>
        {
            new() { Total = 100, Date = now.ToString("yyyy-MM-dd") },
            new() { Total = 200, Date = now.AddMonths(-1).ToString("yyyy-MM-dd") },
            new() { Total = 300, Date = now.AddMonths(-2).ToString("yyyy-MM-dd") }
        };

        var service = new MetricsService();
        var result = service.Calculate(invoices);

        Assert.Equal(100, result.MonthlyTotal);
        Assert.Equal(3, result.TotalInvoices);
        Assert.Equal(600, result.TotalGeneral);
    }

    [Fact]
    public void Calculate_WithEmptyList_ReturnsZeros()
    {
        var invoices = new List<Invoice>();

        var service = new MetricsService();
        var result = service.Calculate(invoices);

        Assert.Equal(0, result.MonthlyTotal);
        Assert.Equal(0, result.TotalInvoices);
        Assert.Equal(0, result.TotalGeneral);
    }

    [Fact]
    public void Calculate_WithInvoiceWithInvalidDate_SkipsMonthlyCalculation()
    {
        var invoices = new List<Invoice>
        {
            new() { Total = 50, Date = "invalid-date" }
        };

        var service = new MetricsService();
        var result = service.Calculate(invoices);

        Assert.Equal(0, result.MonthlyTotal);
        Assert.Equal(1, result.TotalInvoices);
        Assert.Equal(50, result.TotalGeneral);
    }
}
