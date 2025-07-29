// src/app/services/auth.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <-- CAMBIO AQUÍ
import { isPlatformBrowser } from '@angular/common'; // <-- CAMBIO AQUÍ
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  // CAMBIO AQUÍ: Inyectamos PLATFORM_ID para saber dónde se ejecuta el código
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: any) => {
        // CAMBIO AQUÍ: Guardamos el token solo si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access_token);
        }
      })
    );
  }

  logout(): void {
    // CAMBIO AQUÍ: Borramos el token solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // CAMBIO AQUÍ: Leemos el token solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null; // En el servidor, siempre devolvemos null
  }

  isLoggedIn(): boolean {
    // Esta función ahora funciona de forma segura gracias a los cambios en getToken
    return !!this.getToken();
  }
}