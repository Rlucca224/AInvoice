import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, LoginRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return new Observable(subscriber => {
      this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).subscribe({
        next: (response) => {
          this.saveAuthData(response);
          subscriber.next(response);
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return new Observable(subscriber => {
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).subscribe({
        next: (response) => {
          this.saveAuthData(response);
          subscriber.next(response);
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('companyName', response.companyName);
    localStorage.setItem('email', response.email);
  }

  getCompanyName(): string {
    return localStorage.getItem('companyName') || '';
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }
}
