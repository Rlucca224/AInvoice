using FintechCopilot.Domain.Entities;

namespace FintechCopilot.Application.DTOs;

public class UploadResponse
{
    public Guid InvoiceId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public ExtractedInvoiceData ExtractedData { get; set; } = new();
}

public class ExtractedInvoiceData
{
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
