import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-2 text-center text-gray-800">¿Olvidaste tu contraseña?</h2>
        <p class="text-gray-500 text-sm text-center mb-6">
          Ingresa tu correo electrónico y te enviaremos un código de recuperación.
        </p>

        <form #forgotForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailField="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
            <div *ngIf="emailField.invalid && emailField.touched" class="text-red-500 text-sm mt-1">
              Ingresa un correo electrónico válido
            </div>
          </div>

          <div *ngIf="successMessage" class="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {{ successMessage }}
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4 text-center">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="forgotForm.invalid || isSubmitting"
            class="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
            [ngClass]="isSubmitting || forgotForm.invalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Código' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          ¿Recordaste tu contraseña?
          <a routerLink="/login" class="text-blue-600 hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.successMessage = 'Si el correo está registrado, recibirás un código de recuperación. Revisa la consola del servidor.';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al enviar el código. Intenta de nuevo.';
        this.isSubmitting = false;
      }
    });
  }
}
