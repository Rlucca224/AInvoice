import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

        <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="model.email"
              required
              email
              #email="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
            <div *ngIf="email.invalid && email.touched" class="text-red-500 text-sm mt-1">
              Ingresa un correo electrónico válido
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="model.password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
            />
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4 text-center">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="isSubmitting"
            class="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
            [ngClass]="isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <button
            type="button"
            (click)="onClear()"
            class="w-full mt-2 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
          >
            Limpiar
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          ¿Olvidaste tu contraseña?
          <a href="#" (click)="onForgotPassword($event)" class="text-blue-600 hover:underline">Recupérala aquí</a>
        </p>

        <p class="mt-2 text-center text-sm text-gray-600">
          ¿No tienes cuenta?
          <a routerLink="/register" class="text-blue-600 hover:underline">Regístrate</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  model = { email: '', password: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.model).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Credenciales inválidas. Por favor, intenta de nuevo';
        this.isSubmitting = false;
      }
    });
  }

  onClear() {
    this.model = { email: '', password: '' };
    this.errorMessage = '';
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }
}
