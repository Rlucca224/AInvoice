import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    authServiceMock.register.and.returnValue(of({ token: '', companyName: '', email: '' }));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Happy path - Valid form', () => {
    it('should be valid with correct data and enable submit', () => {
      const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      const inputs = fixture.nativeElement.querySelectorAll('input');
      inputs[0].value = 'Mi Empresa';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = 'test@correo.com';
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = 'Password123';
      inputs[2].dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(submitButton.disabled).toBeFalse();
    });
  });

  describe('Sad path - Invalid password', () => {
    it('should be invalid with short password and block submit', () => {
      const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      const inputs = fixture.nativeElement.querySelectorAll('input');
      inputs[0].value = 'Mi Empresa';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = 'test@correo.com';
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = '123';
      inputs[2].dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(submitButton.disabled).toBeTrue();
    });
  });
});
