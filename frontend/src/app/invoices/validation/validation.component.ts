import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { UploadResponse, InvoiceLineItem } from '../../models/invoice.models';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Revisar y Confirmar Datos</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Form -->
          <div class="md:col-span-2 space-y-6">

            <!-- Header status -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center gap-2 text-green-600 mb-6">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">La IA extrajo los siguientes datos</span>
              </div>

              <!-- Two-column grid for basic fields -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Nombre del Proveedor</label>
                  <input type="text" [(ngModel)]="form.provider" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Fecha de Emisión</label>
                  <input type="date" [(ngModel)]="form.date" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Monto Total</label>
                  <input type="text" [(ngModel)]="form.totalStr" (input)="onTotalChange()" required
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    [ngClass]="totalError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'" />
                  <div *ngIf="totalError" class="text-red-500 text-sm mt-1">
                    La IA no pudo determinar el monto. Por favor, ingrésalo manualmente
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Impuesto (IVA)</label>
                  <input type="number" step="0.01" [(ngModel)]="form.tax"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Categoría</label>
                  <select [(ngModel)]="form.category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Selecciona una categoría</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Moneda</label>
                  <select [(ngModel)]="form.currency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment & Transaction -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pago y Referencia
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">Método de Pago</label>
                  <select [(ngModel)]="form.paymentMethod"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Selecciona un método</option>
                    <option value="Cash">Efectivo (Cash)</option>
                    <option value="Credit Card">Tarjeta de Crédito</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Debit Card">Tarjeta de Débito</option>
                    <option value="Bank Transfer">Transferencia Bancaria</option>
                    <option value="Unknown">Desconocido</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-medium mb-2">N° de Transacción / Factura</label>
                  <input type="text" [(ngModel)]="form.transactionNumber" placeholder="ej: #00121, INV-2024-001"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Line Items Table -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                  <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Detalle de Artículos / Servicios
                </h3>
                <button (click)="addLineItem()"
                  class="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir
                </button>
              </div>

              <div *ngIf="form.lineItems.length === 0" class="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <svg class="mx-auto h-10 w-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-sm">No se detectaron artículos. Puedes añadirlos manualmente.</p>
              </div>

              <div *ngIf="form.lineItems.length > 0" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th class="text-left px-3 py-2 font-medium">Descripción</th>
                      <th class="text-center px-3 py-2 font-medium w-20">Cant.</th>
                      <th class="text-right px-3 py-2 font-medium w-28">Precio Unit.</th>
                      <th class="text-right px-3 py-2 font-medium w-28">Subtotal</th>
                      <th class="w-8 px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr *ngFor="let item of form.lineItems; let i = index" class="hover:bg-gray-50">
                      <td class="px-3 py-2">
                        <input type="text" [(ngModel)]="item.description"
                          class="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5 text-gray-800" />
                      </td>
                      <td class="px-3 py-2">
                        <input type="number" [(ngModel)]="item.quantity" min="0" step="1"
                          class="w-full text-center bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5 text-gray-700" />
                      </td>
                      <td class="px-3 py-2">
                        <input type="number" [(ngModel)]="item.price" min="0" step="0.01"
                          class="w-full text-right bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5 text-gray-700" />
                      </td>
                      <td class="px-3 py-2 text-right font-medium text-gray-800">
                        {{ (item.quantity * item.price) | number:'1.2-2' }}
                      </td>
                      <td class="px-2 py-2 text-center">
                        <button (click)="removeLineItem(i)" class="text-red-400 hover:text-red-600 transition-colors">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot *ngIf="form.lineItems.length > 0" class="border-t-2 border-gray-200">
                    <tr>
                      <td colspan="3" class="px-3 py-2 text-right text-sm font-semibold text-gray-600">Subtotal Artículos:</td>
                      <td class="px-3 py-2 text-right font-bold text-gray-800">{{ lineItemsTotal | number:'1.2-2' }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Error & Actions -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4 text-center">
                {{ errorMessage }}
              </div>

              <div class="flex gap-3">
                <button
                  (click)="onConfirm()"
                  [disabled]="!isFormValid() || isSaving"
                  class="flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors flex items-center justify-center gap-2"
                  [ngClass]="!isFormValid() || isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'">
                  <svg *ngIf="isSaving" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  {{ isSaving ? 'Guardando...' : 'Confirmar y Guardar' }}
                </button>
                <button (click)="onDiscard()"
                  class="flex-1 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors">
                  Descartar
                </button>
              </div>
            </div>

          </div>

          <!-- File Preview sidebar -->
          <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-md p-6 h-fit">
              <h3 class="font-semibold text-gray-800 mb-4">Vista previa del archivo</h3>
              <div class="border rounded-lg p-6 text-center bg-gray-50">
                <svg class="mx-auto h-16 w-16 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p class="text-sm font-medium text-gray-700">{{ fileName }}</p>
                <p class="text-xs text-gray-500 mt-1">Documento subido</p>
              </div>
            </div>

            <!-- Summary card -->
            <div *ngIf="form.lineItems.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-blue-800 mb-2">Resumen</h4>
              <div class="space-y-1 text-xs text-blue-700">
                <div class="flex justify-between">
                  <span>Artículos:</span>
                  <span class="font-medium">{{ form.lineItems.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Subtotal artículos:</span>
                  <span class="font-medium">{{ lineItemsTotal | number:'1.2-2' }} {{ form.currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Impuesto:</span>
                  <span class="font-medium">{{ form.tax | number:'1.2-2' }} {{ form.currency }}</span>
                </div>
                <div class="flex justify-between border-t border-blue-300 pt-1 mt-1 text-sm font-bold text-blue-900">
                  <span>Total:</span>
                  <span>{{ form.total | number:'1.2-2' }} {{ form.currency }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ValidationComponent implements OnInit {
  data: UploadResponse | null = null;
  fileName = '';
  isSaving = false;
  errorMessage = '';
  totalError = false;

  form = {
    provider: '',
    date: '',
    totalStr: '',
    total: 0,
    tax: 0,
    currency: 'COP',
    category: '',
    paymentMethod: '',
    transactionNumber: '',
    lineItems: [] as InvoiceLineItem[]
  };

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit() {
    this.data = history.state?.uploadResult || null;
    if (!this.data) {
      this.router.navigate(['/invoices/upload']);
      return;
    }
    this.fileName = this.data.fileName;
    const d = this.data.extractedData;
    this.form.provider = d.provider;
    this.form.date = d.date;
    this.form.totalStr = String(d.total);
    this.form.total = d.total;
    this.form.tax = d.tax;
    this.form.currency = d.currency;
    this.form.category = d.category;
    this.form.paymentMethod = d.paymentMethod || '';
    this.form.transactionNumber = d.transactionNumber || '';
    this.form.lineItems = d.lineItems ? d.lineItems.map(li => ({ ...li })) : [];
    this.validateTotal();
  }

  get lineItemsTotal(): number {
    return this.form.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }

  addLineItem() {
    this.form.lineItems.push({ description: '', quantity: 1, price: 0 });
  }

  removeLineItem(index: number) {
    this.form.lineItems.splice(index, 1);
  }

  onTotalChange() {
    this.validateTotal();
  }

  private validateTotal() {
    const val = this.form.totalStr.trim();
    if (!val || isNaN(Number(val)) || Number(val) <= 0) {
      this.totalError = true;
      this.form.total = 0;
    } else {
      this.totalError = false;
      this.form.total = Number(val);
    }
  }

  isFormValid(): boolean {
    return !this.totalError
      && this.form.provider.trim().length > 0
      && this.form.date.trim().length > 0
      && this.form.category.length > 0;
  }

  onConfirm() {
    if (!this.isFormValid() || this.isSaving || !this.data) return;
    this.isSaving = true;
    this.errorMessage = '';

    this.invoiceService.confirm({
      invoiceId: this.data.invoiceId,
      provider: this.form.provider,
      date: this.form.date,
      total: this.form.total,
      tax: this.form.tax,
      currency: this.form.currency,
      category: this.form.category,
      paymentMethod: this.form.paymentMethod,
      transactionNumber: this.form.transactionNumber,
      lineItems: this.form.lineItems
    }).subscribe({
      next: () => {
        this.router.navigate(['/invoices/history'], {
          state: { message: 'Gasto guardado correctamente' }
        });
      },
      error: () => {
        this.errorMessage = 'Error al guardar el gasto. Intenta de nuevo.';
        this.isSaving = false;
      }
    });
  }

  onDiscard() {
    this.router.navigate(['/invoices/upload']);
  }
}
