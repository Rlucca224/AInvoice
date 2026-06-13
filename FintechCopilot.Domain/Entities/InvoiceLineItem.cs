namespace FintechCopilot.Domain.Entities;

public class InvoiceLineItem
{
    public string Description { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public decimal Price { get; set; }
}
