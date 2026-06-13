namespace FintechCopilot.Application.Interfaces;

public interface IExchangeRateService
{
    Task<decimal> ConvertToUsdAsync(decimal amount, string fromCurrency);
}
