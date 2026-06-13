using FintechCopilot.Application.DTOs;

namespace FintechCopilot.Application.Interfaces;

public interface IGroqService
{
    Task<string> AskAsync(string userMessage, string context);
    Task<ExtractedInvoiceData?> ExtractInvoiceDataAsync(byte[] fileBytes, string fileName, string contentType);
}
