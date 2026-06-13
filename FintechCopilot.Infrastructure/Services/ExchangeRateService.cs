using System.Net.Http.Json;
using System.Text.Json.Serialization;
using FintechCopilot.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace FintechCopilot.Infrastructure.Services;

public class ExchangeRateService : IExchangeRateService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

    public ExchangeRateService(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }

    public async Task<decimal> ConvertToUsdAsync(decimal amount, string fromCurrency)
    {
        if (fromCurrency.Equals("USD", StringComparison.OrdinalIgnoreCase))
            return amount;

        var upper = fromCurrency.ToUpperInvariant();
        var rate = await _cache.GetOrCreateAsync($"fx_{upper}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            var response = await _httpClient.GetFromJsonAsync<FrankfurterResponse>(
                $"https://api.frankfurter.app/latest?from={upper}&to=USD");
            return response?.Rates?.Usd ?? 1m;
        });

        return Math.Round(amount * rate, 2);
    }

    private class FrankfurterResponse
    {
        [JsonPropertyName("rates")]
        public FrankfurterRates? Rates { get; set; }
    }

    private class FrankfurterRates
    {
        [JsonPropertyName("USD")]
        public decimal Usd { get; set; }
    }
}
