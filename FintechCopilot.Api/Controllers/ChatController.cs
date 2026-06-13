using FintechCopilot.Application.DTOs;
using FintechCopilot.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FintechCopilot.Api.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IGroqService _groqService;
    private readonly IInvoiceRepository _invoiceRepository;

    private static readonly string[] GreetingKeywords = [
        "hola", "buenos días", "buenas tardes", "buenas noches", "hey", "que tal",
        "qué tal", "como estas", "cómo estás", "saludos", "buen día"
    ];

    private static readonly string[] FinanceKeywords = [
        "factura", "gasto", "total", "categoría", "categoria", "proveedor",
        "cuanto", "cuánto", "promedio", "mensual", "presupuesto", "gasté",
        "gaste", "dinero", "costo", "precio", "historial", "invoices",
        "invoice", "pago", "balance", "ingreso", "egreso", "resumen",
        "estadística", "estadistica", "grafica", "gráfica", "tendencia",
        "comparar", "mes", "año", "anual", "trimestre"
    ];

    public ChatController(IGroqService groqService, IInvoiceRepository invoiceRepository)
    {
        _groqService = groqService;
        _invoiceRepository = invoiceRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ChatRequest request)
    {
        var message = request.Message.Trim().ToLowerInvariant();
        var isGreeting = GreetingKeywords.Any(k => message.StartsWith(k) || message == k);
        var isFinancial = FinanceKeywords.Any(k => message.Contains(k));

        string context;
        if (isGreeting && !isFinancial)
        {
            context = string.Empty;
        }
        else
        {
            var invoices = await _invoiceRepository.GetAllAsync();
            context = invoices.Count == 0
                ? "No hay facturas registradas aún."
                : string.Join("\n",
                    invoices.Select(i =>
                        $"- {i.Date} | {i.Provider} | {i.Category} | {i.Total:N2} COP"));
        }

        var response = await _groqService.AskAsync(request.Message, context);
        return Ok(new ChatResponse { Message = response });
    }
}
