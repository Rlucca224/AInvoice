import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ResetSuccessComponent } from './auth/reset-success/reset-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './invoices/upload/upload.component';
import { ValidationComponent } from './invoices/validation/validation.component';
import { HistoryComponent } from './invoices/history/history.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'invoices/upload', component: UploadComponent },
  { path: 'invoices/validation/:id', component: ValidationComponent },
  { path: 'invoices/history', component: HistoryComponent },
];
