import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ChatComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-2xl font-semibold text-gray-800">Bienvenido, {{ companyName }}</h2>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a routerLink="/invoices/upload"
             class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div class="text-blue-600 text-3xl mb-3">📄</div>
            <h3 class="font-semibold text-gray-800">Subir Factura</h3>
            <p class="text-sm text-gray-500 mt-1">Procesa una factura o recibo con IA</p>
          </a>
          <a routerLink="/invoices/history"
             class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div class="text-green-600 text-3xl mb-3">📊</div>
            <h3 class="font-semibold text-gray-800">Historial de Gastos</h3>
            <p class="text-sm text-gray-500 mt-1">Revisa y filtra tus gastos registrados</p>
          </a>
        </div>
      </div>

      <app-chat />

      <div
        *ngIf="successMessage"
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity"
      >
        {{ successMessage }}
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  companyName = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.companyName = this.authService.getCompanyName();
    const state = history.state as { message?: string };
    if (state?.message) {
      this.successMessage = state.message;
      setTimeout(() => this.successMessage = '', 5000);
    }
  }
}
