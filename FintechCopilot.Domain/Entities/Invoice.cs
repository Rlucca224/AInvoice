namespace FintechCopilot.Domain.Entities;

public class Invoice
{
    public Guid Id { get; set; }
    public string Provider { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public decimal Tax { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public decimal UsdTotal { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string TransactionNumber { get; set; } = string.Empty;
    public List<InvoiceLineItem> LineItems { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
