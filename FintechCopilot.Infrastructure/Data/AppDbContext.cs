using System.Text.Json;
using FintechCopilot.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FintechCopilot.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Provider).IsRequired().HasMaxLength(200);
            entity.Property(i => i.Category).IsRequired().HasMaxLength(100);
            entity.Property(i => i.Currency).HasMaxLength(10);

            entity.Property(i => i.LineItems)
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, JsonSerializerOptions.Default),
                      v => JsonSerializer.Deserialize<List<InvoiceLineItem>>(v, JsonSerializerOptions.Default) ?? new List<InvoiceLineItem>());
        });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Token).IsRequired().HasMaxLength(200);
            entity.HasIndex(t => t.Token);
        });
    }
}
