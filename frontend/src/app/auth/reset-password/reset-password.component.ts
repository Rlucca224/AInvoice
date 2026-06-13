import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-2 text-center text-gray-800">Restablecer Contraseña</h2>
        <p class="text-gray-500 text-sm text-center mb-6">
          Ingresa el código que recibiste y tu nueva contraseña.
        </p>

        <form #resetForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Código de Recuperación</label>
            <input
              type="text"
              name="token"
              [(ngModel)]="model.token"
              required
              #tokenField="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pega el código aquí"
            />
            <div *ngIf="tokenField.invalid && tokenField.touched" class="text-red-500 text-sm mt-1">
              El código es obligatorio
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="newPassword"
              [(ngModel)]="model.newPassword"
              required
              minlength="8"
              #passwordField="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nueva contraseña"
            />
            <div *ngIf="passwordField.invalid && passwordField.touched" class="text-red-500 text-sm mt-1">
              La contraseña debe tener al menos 8 caracteres, una mayúscula y un número
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmField="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirma tu contraseña"
            />
            <div *ngIf="confirmField.touched && model.newPassword !== confirmPassword" class="text-red-500 text-sm mt-1">
              Las contraseñas no coinciden
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4 text-center">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="resetForm.invalid || model.newPassword !== confirmPassword || isSubmitting"
            class="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
            [ngClass]="resetForm.invalid || model.newPassword !== confirmPassword || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          <a routerLink="/login" class="text-blue-600 hover:underline">Volver al inicio de sesión</a>
        </p>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  model = { token: '', newPassword: '' };
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        // Pre-fill email hint if coming from forgot-password
      }
    });
  }

  onSubmit() {
    if (this.isSubmitting || this.model.newPassword !== this.confirmPassword) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.model).subscribe({
      next: () => {
        this.router.navigate(['/reset-success']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al restablecer la contraseña. Intenta de nuevo.';
        this.isSubmitting = false;
      }
    });
  }
}
