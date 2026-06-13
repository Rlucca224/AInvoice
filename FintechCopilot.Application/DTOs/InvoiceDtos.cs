using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.DTOs;

public class ConfirmInvoiceRequest
{
    public Guid InvoiceId { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public decimal Tax { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string TransactionNumber { get; set; } = string.Empty;
    public List<InvoiceLineItem> LineItems { get; set; } = [];
}

public class ConfirmInvoiceResponse
{
    public string Message { get; set; } = string.Empty;
}

public class InvoiceResponse
{
    public Guid Id { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public decimal Tax { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal UsdTotal { get; set; }
    public string Category { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string TransactionNumber { get; set; } = string.Empty;
    public List<InvoiceLineItem> LineItems { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}
