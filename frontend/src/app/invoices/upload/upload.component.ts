import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Subir Factura o Recibo</h2>
        <p class="text-gray-600 mb-6">Arrastra tu archivo aquí o haz clic para seleccionarlo</p>

        <div
          class="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors"
          [ngClass]="isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
        >
          <input
            #fileInput
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            class="hidden"
            (change)="onFileSelected($event)"
          />

          <div *ngIf="!selectedFile" class="text-gray-500">
            <svg class="mx-auto h-12 w-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Arrastra y suelta tu archivo aquí</p>
            <p class="text-sm mt-1">o haz clic para explorar</p>
            <p class="text-xs mt-3 text-gray-400">PDF, JPEG o PNG • Máx. 5 MB</p>
          </div>

          <div *ngIf="selectedFile && !errorMessage" class="text-gray-700">
            <svg class="mx-auto h-12 w-12 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-medium">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">{{ formatSize(selectedFile.size) }}</p>
          </div>

          <div *ngIf="errorMessage" class="text-red-500">
            <svg class="mx-auto h-12 w-12 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Moneda de la factura</label>
          <select
            [(ngModel)]="selectedCurrency"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="USD">USD (Dólar estadounidense)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="ARS">ARS (Peso argentino)</option>
          </select>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            (click)="onProcess()"
            [disabled]="!selectedFile || isProcessing || !!errorMessage"
            class="flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors flex items-center justify-center gap-2"
            [ngClass]="!selectedFile || isProcessing || errorMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          >
            <svg *ngIf="isProcessing" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {{ isProcessing ? 'Analizando con IA...' : 'Procesar con IA' }}
          </button>
          <button
            (click)="onCancel(); $event.stopPropagation()"
            class="flex-1 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `
})
export class UploadComponent {
  selectedFile: File | null = null;
  selectedCurrency = 'USD';
  isDragOver = false;
  isProcessing = false;
  errorMessage = '';

  private readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  private readonly ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
  private readonly MAX_SIZE = 5 * 1024 * 1024;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.validateAndSetFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.validateAndSetFile(file);
  }

  private validateAndSetFile(file: File) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(ext)) {
      this.selectedFile = null;
      this.errorMessage = 'Archivo no válido. Solo se admiten formatos PDF, JPEG o PNG menores a 5MB';
      return;
    }
    if (file.size > this.MAX_SIZE) {
      this.selectedFile = null;
      this.errorMessage = 'Archivo no válido. Solo se admiten formatos PDF, JPEG o PNG menores a 5MB';
      return;
    }
    this.selectedFile = file;
    this.errorMessage = '';
  }

  onProcess() {
    if (!this.selectedFile || this.isProcessing) return;
    this.isProcessing = true;
    this.errorMessage = '';

    this.invoiceService.upload(this.selectedFile, this.selectedCurrency).subscribe({
      next: (response) => {
        this.router.navigate(['/invoices/validation', response.invoiceId], {
          state: { uploadResult: response }
        });
      },
      error: () => {
        this.errorMessage = 'Error al procesar el archivo. Intenta de nuevo.';
        this.isProcessing = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
