import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceResponse } from '../../models/invoice.models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Historial de Gastos</h2>
          <a *ngIf="allInvoices.length > 0" routerLink="/invoices/upload" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors">+ Subir Factura</a>
        </div>

        <div *ngIf="successMessage" class="bg-green-500 text-white px-4 py-3 rounded-lg mb-4 text-center font-medium">
          {{ successMessage }}
        </div>

        <div *ngIf="allInvoices.length === 0" class="bg-white rounded-lg shadow-md p-16 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500 text-lg font-medium mb-2">Aún no tienes gastos registrados</p>
          <p class="text-gray-400 text-sm mb-6">¡Sube tu primera factura para que el copiloto la analice!</p>
          <a routerLink="/invoices/upload" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors">Subir Factura</a>
        </div>

        <ng-container *ngIf="allInvoices.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-md p-5">
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Gasto Total del Mes</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ monthlyTotal | number:'1.2-2' }} USD</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-5">
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Facturas</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ filteredInvoices.length }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-5">
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Total General</p>
              <p class="text-3xl font-bold text-gray-800 mt-2">{{ totalGeneral | number:'1.2-2' }} USD</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap gap-4 items-end">
            <div>
              <label class="block text-xs text-gray-500 font-medium mb-1">Categoría</label>
              <select [(ngModel)]="filterCategory" (change)="applyFilters()" class="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas las categorías</option>
                <option value="Servicios">Servicios</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Oficina">Oficina</option>
                <option value="Transporte">Transporte</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 font-medium mb-1">Fecha Desde</label>
              <input type="date" [(ngModel)]="filterStartDate" (change)="applyFilters()" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 font-medium mb-1">Fecha Hasta</label>
              <input type="date" [(ngModel)]="filterEndDate" (change)="applyFilters()" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th class="text-left px-4 py-3 font-medium">Proveedor</th>
                  <th class="text-left px-4 py-3 font-medium">Fecha</th>
                  <th class="text-left px-4 py-3 font-medium">Categoría</th>
                  <th class="text-left px-4 py-3 font-medium">Pago</th>
                  <th class="text-right px-4 py-3 font-medium">IVA</th>
                  <th class="text-right px-4 py-3 font-medium">Monto Original</th>
                  <th class="text-right px-4 py-3 font-medium">Equiv. USD</th>
                  <th class="text-center px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let inv of paginatedInvoices" class="hover:bg-blue-50 cursor-pointer transition-colors" (click)="openDetail(inv)">
                  <td class="px-4 py-3">
                    <p class="font-medium text-gray-800">{{ inv.provider }}</p>
                    <p *ngIf="inv.transactionNumber" class="text-xs text-gray-400 mt-0.5">#{{ inv.transactionNumber }}</p>
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ inv.date }}</td>
                  <td class="px-4 py-3">
                    <span class="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">{{ inv.category }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span *ngIf="inv.paymentMethod" class="flex items-center gap-1 text-gray-600">
                      <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {{ inv.paymentMethod }}
                    </span>
                    <span *ngIf="!inv.paymentMethod" class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 text-right text-gray-600">{{ inv.tax | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-right text-gray-600">{{ inv.total | number:'1.2-2' }} {{ inv.currency }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-gray-800">$ {{ inv.usdTotal | number:'1.2-2' }}</td>
                  <td class="px-4 py-3 text-center" (click)="$event.stopPropagation()">
                    <button (click)="onDelete(inv.id)" class="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                      <svg class="h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="px-4 py-3 flex justify-between items-center border-t border-gray-100 bg-gray-50">
              <p class="text-xs text-gray-500">
                Mostrando {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filteredInvoices.length) }} de {{ filteredInvoices.length }}
              </p>
              <div class="flex gap-2">
                <button (click)="prevPage()" [disabled]="currentPage === 1"
                  class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                <button (click)="nextPage()" [disabled]="currentPage >= totalPages"
                  class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>

    <!-- Detail Modal -->
    <div *ngIf="selectedInvoice" class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="closeDetail()">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        
        <!-- Modal header -->
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ selectedInvoice.provider }}</h3>
            <p *ngIf="selectedInvoice.transactionNumber" class="text-xs text-gray-400 mt-0.5">Ref: {{ selectedInvoice.transactionNumber }}</p>
          </div>
          <button (click)="closeDetail()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-5">
          <!-- Key facts -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Fecha</p>
              <p class="text-sm font-semibold text-gray-800 mt-1">{{ selectedInvoice.date }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Categoría</p>
              <span class="inline-block mt-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">{{ selectedInvoice.category }}</span>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Método de Pago</p>
              <p class="text-sm font-semibold text-gray-800 mt-1">{{ selectedInvoice.paymentMethod || '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Monto Original</p>
              <p class="text-sm font-semibold text-gray-800 mt-1">{{ selectedInvoice.total | number:'1.2-2' }} {{ selectedInvoice.currency }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">IVA / Impuesto</p>
              <p class="text-sm font-semibold text-gray-800 mt-1">{{ selectedInvoice.tax | number:'1.2-2' }} {{ selectedInvoice.currency }}</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-xs text-blue-600 font-medium uppercase tracking-wide">Equiv. USD</p>
              <p class="text-sm font-bold text-blue-800 mt-1">$ {{ selectedInvoice.usdTotal | number:'1.2-2' }}</p>
            </div>
          </div>

          <!-- Line Items -->
          <div *ngIf="selectedInvoice.lineItems && selectedInvoice.lineItems.length > 0">
            <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Detalle de Artículos
            </h4>
            <div class="overflow-hidden rounded-lg border border-gray-200">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th class="text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase w-16">Cant.</th>
                    <th class="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase w-24">Precio</th>
                    <th class="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase w-24">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let item of selectedInvoice.lineItems" class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-gray-800">{{ item.description }}</td>
                    <td class="px-3 py-2 text-center text-gray-600">{{ item.quantity }}</td>
                    <td class="px-4 py-2 text-right text-gray-600">{{ item.price | number:'1.2-2' }}</td>
                    <td class="px-4 py-2 text-right font-medium text-gray-800">{{ (item.quantity * item.price) | number:'1.2-2' }}</td>
                  </tr>
                </tbody>
                <tfoot class="border-t-2 border-gray-200 bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Total artículos:</td>
                    <td class="px-4 py-2 text-right font-bold text-gray-900">
                      {{ getLineItemsTotal(selectedInvoice) | number:'1.2-2' }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div *ngIf="!selectedInvoice.lineItems || selectedInvoice.lineItems.length === 0" class="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p class="text-sm">No hay artículos detallados para esta factura.</p>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-3 rounded-b-2xl flex justify-end gap-3">
          <button (click)="onDeleteFromModal()" class="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 rounded-md hover:bg-red-50 transition-colors">
            Eliminar
          </button>
          <button (click)="closeDetail()" class="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-medium">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  allInvoices: InvoiceResponse[] = [];
  filteredInvoices: InvoiceResponse[] = [];
  paginatedInvoices: InvoiceResponse[] = [];
  successMessage = '';
  Math = Math;
  selectedInvoice: InvoiceResponse | null = null;

  filterCategory = '';
  filterStartDate = '';
  filterEndDate = '';

  currentPage = 1;
  pageSize = 10;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit() {
    const state = history.state as { message?: string };
    if (state?.message) {
      this.successMessage = state.message;
      setTimeout(() => this.successMessage = '', 5000);
    }
    this.loadInvoices();
  }

  private loadInvoices() {
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.allInvoices = data;
        this.applyFilters();
      }
    });
  }

  openDetail(inv: InvoiceResponse) {
    this.selectedInvoice = inv;
  }

  closeDetail() {
    this.selectedInvoice = null;
  }

  onDeleteFromModal() {
    if (!this.selectedInvoice) return;
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    this.invoiceService.delete(this.selectedInvoice.id).subscribe({
      next: () => {
        this.closeDetail();
        this.loadInvoices();
      },
      error: () => alert('Error al eliminar el gasto')
    });
  }

  getLineItemsTotal(inv: InvoiceResponse): number {
    return (inv.lineItems || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }

  get monthlyTotal(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return this.filteredInvoices
      .filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, i) => sum + i.usdTotal, 0);
  }

  get totalGeneral(): number {
    return this.filteredInvoices.reduce((sum, i) => sum + i.usdTotal, 0);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInvoices.length / this.pageSize) || 1;
  }

  applyFilters() {
    let result = [...this.allInvoices];

    if (this.filterCategory) {
      result = result.filter(i => i.category === this.filterCategory);
    }
    if (this.filterStartDate) {
      result = result.filter(i => i.date >= this.filterStartDate!);
    }
    if (this.filterEndDate) {
      result = result.filter(i => i.date <= this.filterEndDate!);
    }

    this.filteredInvoices = result;
    this.currentPage = 1;
    this.updatePage();
  }

  private updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedInvoices = this.filteredInvoices.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  onDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    this.invoiceService.delete(id).subscribe({
      next: () => this.loadInvoices(),
      error: () => alert('Error al eliminar el gasto')
    });
  }
}
