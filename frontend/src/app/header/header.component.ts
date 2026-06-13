import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a routerLink="/dashboard" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
          AInvoice
        </a>
        <div class="flex gap-4 items-center">
          <button
            (click)="onLogout()"
            class="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
