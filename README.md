# AInvoice

**AI-powered invoice management platform.** Upload invoices (PDF or image), extract data automatically with AI OCR, convert currencies, track expenses, and chat with an intelligent financial assistant.

Built with **Angular 18** + **.NET 10** + **SQLite**.

## Features

- **AI Invoice Upload** — Drag & drop PDF/JPEG/PNG files. OCR extracts provider, date, total, category, line items, and more using Groq Vision.
- **Multi-currency** — Support for USD, EUR, ARS. Automatic USD conversion via live exchange rates (Frankfurter API).
- **Expense History** — Filter, search, and paginate your invoices. Detailed modal with line items and USD equivalent.
- **AI Chat Assistant** — Ask questions about your expenses, totals, categories, or providers in natural language.
- **User Authentication** — Register, login, JWT-based sessions, and forgot password recovery flow.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 18 (standalone components, signals) |
| Backend | .NET 10 (Clean Architecture) |
| Database | SQLite (via Entity Framework Core) |
| AI | Groq API (Llama 3.3, Llama 4 Scout) |
| Auth | JWT + BCrypt |
| Exchange Rates | Frankfurter API |
| Styling | Tailwind CSS |

## Project Structure

```
FintechCopilot.sln
├── FintechCopilot.Domain/       # Entities
├── FintechCopilot.Application/  # DTOs, Interfaces, Services
├── FintechCopilot.Infrastructure/ # Data, Repositories, External Services
├── FintechCopilot.Api/          # Controllers, Program.cs
├── FintechCopilot.Tests/        # xUnit tests
└── frontend/                    # Angular 18 app
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 20+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- A [Groq API key](https://console.groq.com/keys)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Rlucca224/AInvoice.git
cd AInvoice
```

2. Set up backend secrets:
```bash
cp FintechCopilot.Api/appsettings.Development.example.json FintechCopilot.Api/appsettings.Development.json
```
Edit `appsettings.Development.json` and add your Groq API key.

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Run the backend:
```bash
dotnet run --project FintechCopilot.Api
```

5. Run the frontend (in a separate terminal):
```bash
cd frontend
npx ng serve -o
```

The app will be available at `http://localhost:4200`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/invoices/upload` | Upload invoice (AI extraction) |
| POST | `/api/invoices/confirm` | Confirm and save extracted data |
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/metrics` | Expense metrics |
| DELETE | `/api/invoices/{id}` | Delete invoice |
| POST | `/api/chat` | Send message to AI assistant |

## License

MIT
