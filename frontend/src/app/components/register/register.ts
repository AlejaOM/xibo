// src/app/components/register/register.ts

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { formatDate, CommonModule } from '@angular/common';

// Imports de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

// Validador (sin cambios)
export function passwordValidator(): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(value);
    return !passwordValid ? { passwordStrength: true } : null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, RecaptchaModule, RecaptchaFormsModule,
    MatSnackBarModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // Cambiado a .scss para mejor estilo
})
export class RegisterComponent {
  registerForm: FormGroup;
  siteKey = '6LcGzZIrAAAAAFA3tHXGUvxY2OMvHQNSKxTr6woq';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator()]],
      recaptcha_token: ['', Validators.required]
    });
  }

  // --- LÓGICA AÑADIDA PARA LA LISTA DINÁMICA ---
  get passwordControl() {
    return this.registerForm.get('password')!;
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.passwordControl.value);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.passwordControl.value);
  }

  get hasNumeric(): boolean {
    return /[0-9]/.test(this.passwordControl.value);
  }

  get hasSpecialChar(): boolean {
    return /[\W_]/.test(this.passwordControl.value);
  }

  get isLongEnough(): boolean {
    return this.passwordControl.value?.length >= 10;
  }
  // --- FIN DE LA LÓGICA AÑADIDA ---

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value;
    const formattedDate = formatDate(formValue.birth_date, 'yyyy-MM-dd', 'en-US');
    const userData = { ...formValue, birth_date: formattedDate };

    this.authService.register(userData).subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso. Ahora puedes iniciar sesión.', 'Ok', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const detail = err.error?.detail;
        let message = 'Error en el registro.';
        if (typeof detail === 'string') {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail.map(d => d.msg).join(' ');
        }
        this.snackBar.open(message, 'Cerrar', { duration: 5000 });
      }
    });
  }
}