// src/app/components/login/login.ts

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

// --- LA MAGIA ESTÁ AQUÍ ---
// Importamos todos los módulos que el HTML necesita
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha'; 

@Component({
  selector: 'app-login',
  standalone: true,
  // Y los añadimos al array de imports del componente
  imports: [
    ReactiveFormsModule, // Para [formGroup]
    RouterLink,          // Para routerLink="/register"
    MatCardModule,       // Para <mat-card>
    MatFormFieldModule,  // Para <mat-form-field>
    MatInputModule,      // Para el input con matInput
    MatButtonModule,     // Para mat-raised-button
    RecaptchaModule,    // Para <ngx-recaptcha2>
    MatSnackBarModule,
    RecaptchaFormsModule    // Para las notificaciones
  ],
  templateUrl: './login.html',

  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  // ¡¡IMPORTANTE!! Reemplaza esto con tu Site Key de reCAPTCHA
  siteKey = '6LcGzZIrAAAAAFA3tHXGUvxY2OMvHQNSKxTr6woq';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha_token: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: (err) => {
          this.snackBar.open('Email o contraseña incorrectos', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}