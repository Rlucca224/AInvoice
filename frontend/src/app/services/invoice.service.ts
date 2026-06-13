import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadResponse, ConfirmInvoiceRequest, ConfirmInvoiceResponse, InvoiceResponse } from '../models/invoice.models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:5000/api/invoices';

  constructor(private http: HttpClient) {}

  upload(file: File, currency: string = 'COP'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('currency', currency);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  confirm(data: ConfirmInvoiceRequest): Observable<ConfirmInvoiceResponse> {
    return this.http.post<ConfirmInvoiceResponse>(`${this.apiUrl}/confirm`, data);
  }

  getAll(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(this.apiUrl);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
