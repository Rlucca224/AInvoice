using FintechCopilot.Application.DTOs;
using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FintechCopilot.Api.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IExchangeRateService _exchangeRateService;
    private readonly IGroqService _groqService;

    public InvoicesController(
        IInvoiceRepository invoiceRepository, 
        IExchangeRateService exchangeRateService,
        IGroqService groqService)
    {
        _invoiceRepository = invoiceRepository;
        _exchangeRateService = exchangeRateService;
        _groqService = groqService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? currency)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new ErrorResponse { Message = "No se ha seleccionado ningún archivo" });

        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new ErrorResponse { Message = "Archivo no válido. Solo se admiten formatos PDF, JPEG o PNG" });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new ErrorResponse { Message = "Archivo no válido. Solo se admiten formatos PDF, JPEG o PNG menores a 5MB" });

        try
        {
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            var extractedData = await _groqService.ExtractInvoiceDataAsync(fileBytes, file.FileName, file.ContentType);

            if (extractedData == null)
            {
                extractedData = new ExtractedInvoiceData
                {
                    Provider = "Desconocido",
                    Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    Total = 0,
                    Tax = 0,
                    Currency = string.IsNullOrEmpty(currency) ? "COP" : currency.ToUpperInvariant(),
                    Category = "Otros"
                };
            }
            else
            {
                if (string.IsNullOrEmpty(extractedData.Currency) || extractedData.Currency.Equals("desconocido", StringComparison.OrdinalIgnoreCase))
                {
                    extractedData.Currency = string.IsNullOrEmpty(currency) ? "COP" : currency.ToUpperInvariant();
                }
            }

            var response = new UploadResponse
            {
                InvoiceId = Guid.NewGuid(),
                FileName = file.FileName,
                ExtractedData = extractedData
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ErrorResponse { Message = $"Error al procesar el documento: {ex.Message}" });
        }
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] ConfirmInvoiceRequest request)
    {
        if (request.Total <= 0)
            return BadRequest(new ErrorResponse { Message = "El monto total debe ser un valor numérico válido" });

        var currency = string.IsNullOrEmpty(request.Currency) ? "COP" : request.Currency;
        var usdTotal = await _exchangeRateService.ConvertToUsdAsync(request.Total, currency);

        var invoice = new Invoice
        {
            Id = request.InvoiceId,
            Provider = request.Provider,
            Date = request.Date,
            Total = request.Total,
            Tax = request.Tax,
            Currency = currency,
            UsdTotal = usdTotal,
            Category = request.Category,
            PaymentMethod = request.PaymentMethod,
            TransactionNumber = request.TransactionNumber,
            LineItems = request.LineItems,
            CreatedAt = DateTime.UtcNow
        };

        await _invoiceRepository.AddAsync(invoice);

        return Ok(new ConfirmInvoiceResponse { Message = "Gasto guardado correctamente" });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var invoices = await _invoiceRepository.GetAllAsync();
        var response = invoices.Select(i => new InvoiceResponse
        {
            Id = i.Id,
            Provider = i.Provider,
            Date = i.Date,
            Total = i.Total,
            Tax = i.Tax,
            Currency = i.Currency,
            UsdTotal = i.UsdTotal,
            Category = i.Category,
            PaymentMethod = i.PaymentMethod,
            TransactionNumber = i.TransactionNumber,
            LineItems = i.LineItems,
            CreatedAt = i.CreatedAt
        });
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        if (invoice is null)
            return NotFound(new ErrorResponse { Message = "Factura no encontrada" });

        await _invoiceRepository.DeleteAsync(invoice);
        return Ok(new { message = "Gasto eliminado correctamente" });
    }
}
