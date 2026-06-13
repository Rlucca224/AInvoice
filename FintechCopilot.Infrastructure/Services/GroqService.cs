using System.ClientModel;
using System.Text;
using System.Text.Json;
using FintechCopilot.Application.DTOs;
using FintechCopilot.Application.Interfaces;
using FintechCopilot.Domain.Entities;
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;

namespace FintechCopilot.Infrastructure.Services;

public class GroqService : IGroqService
{
    private readonly ChatClient? _chatClient;
    private readonly ChatClient? _visionChatClient;

    public GroqService(IConfiguration configuration)
    {
        var apiKey = configuration["Groq:ApiKey"]
            ?? Environment.GetEnvironmentVariable("GROQ_API_KEY");

        if (string.IsNullOrEmpty(apiKey))
            return;

        var model = configuration["Groq:Model"] ?? "gpt-oss-120b";
        var visionModel = configuration["Groq:VisionModel"] ?? "llama-3.2-11b-vision-preview";
        var options = new OpenAIClientOptions
        {
            Endpoint = new Uri("https://api.groq.com/openai/v1")
        };

        var client = new OpenAIClient(new ApiKeyCredential(apiKey), options);
        _chatClient = client.GetChatClient(model);
        _visionChatClient = client.GetChatClient(visionModel);
    }

    public async Task<string> AskAsync(string userMessage, string context)
    {
        if (_chatClient is null)
            return GenerateFallbackResponse(userMessage, context);

        try
        {
            string systemPrompt;
            if (string.IsNullOrEmpty(context))
            {
                systemPrompt = """
Eres un asistente virtual amigable y conversacional. Tu nombre es "Asistente".
Responde saludos de forma cálida y natural. Preséntate brevemente como un asistente financiero.
No inventes datos financieros ni facturas. Si el usuario te pregunta sobre finanzas o facturas,
indícale que primero debe cargar facturas para poder analizarlas.
Mantén tus respuestas cortas y naturales.
""";
            }
            else
            {
                systemPrompt = $"""
Eres un copiloto financiero experto. Analizas los gastos de un usuario y respondes preguntas sobre sus finanzas.
Usa SIEMPRE los datos reales que se te proporcionan a continuación para responder. No inventes datos.
NO menciones todos los datos de contexto a menos que el usuario pregunte específicamente por ellos.
Si el usuario solo saluda o hace una pregunta general, responde de forma breve y amable sin soltar datos financieros.
Espera a que el usuario pregunte específicamente por totales, categorías, proveedores o detalles antes de dar datos concretos.
Si la pregunta no está relacionada con finanzas, responde: "Lo siento, como tu copiloto financiero solo puedo ayudarte a analizar tus facturas, gastos y proyecciones."

Contexto de gastos del usuario:
{context}
""";
            }

            var response = await _chatClient.CompleteChatAsync([
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userMessage)
            ]);

            return response.Value.Content[0].Text;
        }
        catch
        {
            return GenerateFallbackResponse(userMessage, context);
        }
    }

    private static string GenerateFallbackResponse(string question, string context)
    {
        var lower = question.ToLowerInvariant();

        if (string.IsNullOrEmpty(context) || context == "No hay facturas registradas aún.")
        {
            if (lower.Contains("hola") || lower.Contains("buenos") || lower.Contains("buenas") ||
                lower.Contains("saludos") || lower.Contains("hey") || lower.Contains("que tal") ||
                lower.Contains("qué tal") || lower.Contains("como estas") || lower.Contains("cómo estás"))
            {
                return "¡Hola! Soy tu Asistente. ¿En qué puedo ayudarte? Puedes preguntarme sobre tus facturas, gastos o cualquier cosa relacionada con tus finanzas.";
            }

            if (lower.Contains("factura") || lower.Contains("gasto") || lower.Contains("total") ||
                lower.Contains("cuanto") || lower.Contains("cuánto") || lower.Contains("dinero"))
            {
                return "Aún no tienes facturas registradas. ¡Sube tu primera factura desde el panel y vuelve a preguntarme!";
            }

            return "¡Hola! Soy tu Asistente. Para poder ayudarte con tus finanzas, primero necesitas cargar algunas facturas desde el panel. ¿Te gustaría saber más sobre cómo funciona el sistema?";
        }

        var lines = context.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        var invoices = new List<Invoice>();

        foreach (var line in lines)
        {
            var parts = line.Split(" | ");
            if (parts.Length == 4
                && decimal.TryParse(parts[3].Replace(" COP", "").Replace(",", ""), out var total))
            {
                invoices.Add(new Invoice
                {
                    Date = parts[0],
                    Provider = parts[1],
                    Category = parts[2].ToLowerInvariant(),
                    Total = total
                });
            }
        }

        if (invoices.Count == 0)
            return "No hay facturas registradas aún. ¡Sube tu primera factura desde el panel!";

        if (lower.Contains("total") || lower.Contains("cuanto") || lower.Contains("cuánto") || lower.Contains("gasté"))
        {
            var total = invoices.Sum(i => i.Total);
            return $"Has registrado un total de **{total:N2} COP** en {invoices.Count} factura(s). " +
                   $"Tu gasto mensual promedio es de **{(invoices.Count > 0 ? total / Math.Max(1, invoices.Count) : 0):N2} COP**.";
        }

        foreach (var cat in new[] { "tecnología", "servicios", "alimentación", "marketing", "otros" })
        {
            if (lower.Contains(cat))
            {
                var catInvoices = invoices.Where(i => i.Category.Equals(cat, StringComparison.OrdinalIgnoreCase)).ToList();
                var catTotal = catInvoices.Sum(i => i.Total);
                var grandTotal = invoices.Sum(i => i.Total);
                var percent = grandTotal > 0 ? (catTotal / grandTotal) * 100 : 0;

                if (catInvoices.Count == 0)
                    return $"No tienes gastos registrados en la categoría **{char.ToUpper(cat[0]) + cat[1..]}** aún.";

                var topProvider = catInvoices.OrderByDescending(i => i.Total).First().Provider;
                return $"Has gastado un total de **{catTotal:N2} COP** en **{char.ToUpper(cat[0]) + cat[1..]}** ({topProvider}), " +
                       $"lo cual representa el **{percent:N1}%** de tus gastos totales. " +
                       $"{(percent < 30 ? "¡Buen trabajo manteniéndote dentro del límite!" : percent < 60 ? "Considera ajustar tu presupuesto para esta categoría." : "Esta categoría representa una parte significativa de tus gastos. ¿Quieres revisar las facturas?")}";
            }
        }

        if (lower.Contains("proveedor") || lower.Contains("proveedores"))
        {
            var providers = invoices.Select(i => i.Provider).Distinct().ToList();
            if (providers.Count == 0)
                return "Aún no tienes proveedores registrados.";
            return $"Tienes **{providers.Count}** proveedor(es) registrado(s): {string.Join(", ", providers)}.";
        }

        if (lower.Contains("promedio"))
        {
            var avg = invoices.Count > 0 ? invoices.Average(i => i.Total) : 0;
            return $"El monto promedio de tus facturas es de **{avg:N2} COP**.";
        }

        if (lower.Contains("hola") || lower.Contains("buenos") || lower.Contains("buenas"))
        {
            return "¡Hola! ¿Cómo puedo ayudarte con tus finanzas hoy? Puedes preguntarme sobre el total de tus gastos, por categoría o por proveedor.";
        }

        var allTotal = invoices.Sum(i => i.Total);
        return $"Tienes **{invoices.Count}** factura(s) registrada(s) por un total de **{allTotal:N2} COP**. " +
               $"¿Te gustaría saber el desglose por categoría o por proveedor?";
    }

    public async Task<ExtractedInvoiceData?> ExtractInvoiceDataAsync(byte[] fileBytes, string fileName, string contentType)
    {
        if (_visionChatClient is null)
        {
            return null;
        }

        try
        {
            string documentText = string.Empty;
            bool isPdf = contentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase) ||
                         fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase);

            if (isPdf)
            {
                var sb = new StringBuilder();
                using (var document = UglyToad.PdfPig.PdfDocument.Open(fileBytes))
                {
                    foreach (var page in document.GetPages())
                    {
                        sb.AppendLine(page.Text);
                    }
                }
                documentText = sb.ToString();
            }

            var categories = new[] { "Servicios", "Tecnología", "Oficina", "Transporte", "Alimentación", "Otros" };
            var systemPrompt = $$"""
Eres un asistente experto en OCR y extracción de datos financieros. 
Analiza el documento proporcionado y extrae la información en un formato JSON estrictamente válido.
Debes devolver ÚNICAMENTE el objeto JSON sin explicaciones, sin bloques de código de markdown (es decir, no uses ```json), ni texto adicional.

El formato del JSON debe ser exactamente el siguiente:
{
  "Provider": "Nombre del proveedor o emisor de la factura",
  "Date": "Fecha de emisión en formato YYYY-MM-DD",
  "Total": 1234.56,
  "Tax": 12.34,
  "Currency": "Moneda de la factura (ej: USD, COP, EUR)",
  "Category": "Una de las siguientes categorías autorizadas: {{string.Join(", ", categories)}}",
  "PaymentMethod": "Método de pago detectado (ej: Cash, Credit Card, Visa, Mastercard, Debit Card, Bank Transfer, Unknown)",
  "TransactionNumber": "Número de factura, recibo o transacción (ej: #00121, Tran 086126, INV-2024-001)",
  "LineItems": [
    {
      "Description": "Nombre o descripción del artículo o servicio",
      "Quantity": 1.0,
      "Price": 15.99
    }
  ]
}

Instrucciones de negocio:
- Mapea la categoría lo mejor posible a una de las permitidas. Si no estás seguro, usa "Otros".
- Si no encuentras el valor del impuesto (Tax/IVA), pon 0.
- Si no encuentras la fecha, usa la fecha actual.
- Si no encuentras el proveedor, usa "Desconocido".
- Para PaymentMethod: si ves "Cash", "Efectivo" o similar usa "Cash". Si ves Visa, Mastercard, American Express, etc. usa ese nombre específico. Si no encuentras el método, usa "Unknown".
- Para TransactionNumber: usa el número de factura, recibo, orden o transacción más prominente del documento. Si no hay ninguno, usa cadena vacía "".
- Para LineItems: extrae TODOS los artículos o líneas de servicio visibles en la factura con su descripción, cantidad y precio unitario (ya con descuentos aplicados). Si no hay artículos identificables, usa un array vacío [].
- Asegúrate de que los campos numéricos (Total, Tax, Quantity, Price) sean double/decimal válidos en JSON (sin símbolos de moneda ni comas para miles).
""";


            string jsonResponse = string.Empty;

            if (isPdf)
            {
                var response = await _visionChatClient.CompleteChatAsync([
                    new SystemChatMessage(systemPrompt),
                    new UserChatMessage($"Contenido de la factura extraído:\n\n{documentText}")
                ]);
                jsonResponse = response.Value.Content[0].Text;
            }
            else
            {
                var imagePart = ChatMessageContentPart.CreateImagePart(BinaryData.FromBytes(fileBytes), contentType);
                var textPart = ChatMessageContentPart.CreateTextPart("Analiza la siguiente imagen de una factura y extrae la información requerida.");
                
                var response = await _visionChatClient.CompleteChatAsync([
                    new SystemChatMessage(systemPrompt),
                    new UserChatMessage([textPart, imagePart])
                ]);
                jsonResponse = response.Value.Content[0].Text;
            }

            jsonResponse = CleanJson(jsonResponse);

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<ExtractedInvoiceData>(jsonResponse, serializeOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error extracting invoice data: {ex.Message}");
            return null;
        }
    }

    private static string CleanJson(string input)
    {
        var clean = input.Trim();
        if (clean.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean.Substring(7);
        }
        else if (clean.StartsWith("```", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean.Substring(3);
        }

        if (clean.EndsWith("```"))
        {
            clean = clean.Substring(0, clean.Length - 3);
        }

        return clean.Trim();
    }
}
