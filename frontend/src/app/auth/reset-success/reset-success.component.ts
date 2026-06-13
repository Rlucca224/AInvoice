import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div class="text-green-500 text-5xl mb-4">✓</div>
        <h2 class="text-2xl font-bold mb-2 text-gray-800">¡Contraseña Restablecida!</h2>
        <p class="text-gray-500 mb-6">
          Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <a
          routerLink="/login"
          class="inline-block w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </a>
      </div>
    </div>
  `
})
export class ResetSuccessComponent {}
