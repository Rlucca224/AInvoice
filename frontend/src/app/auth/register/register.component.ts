import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>

        <form #registerForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Nombre de Empresa</label>
            <input
              type="text"
              name="companyName"
              [(ngModel)]="model.companyName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mi Empresa S.A.S"
            />
          </div>

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
              pattern="^(?=.*[A-Z])(?=.*\\d).{8,}$"
              #password="ngModel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
            />
            <div *ngIf="password.invalid && password.touched" class="text-red-500 text-sm mt-1">
              La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un número
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4 text-center">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="isSubmitting || registerForm.form.invalid"
            class="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
            [ngClass]="(isSubmitting || registerForm.form.invalid) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          >
            {{ isSubmitting ? 'Creando cuenta...' : 'Registrarse' }}
          </button>

          <button
            type="button"
            (click)="onCancel()"
            class="w-full mt-2 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
          >
            Cancelar
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="text-blue-600 hover:underline">Iniciar sesión</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  model = { companyName: '', email: '', password: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.register(this.model).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'], {
          state: { message: '¡Cuenta creada con éxito!' }
        });
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al crear la cuenta';
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.model = { companyName: '', email: '', password: '' };
    this.errorMessage = '';
  }
}
