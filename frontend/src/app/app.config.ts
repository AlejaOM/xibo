// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
// CAMBIO AQUÍ: Importa withFetch
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // CAMBIO AQUÍ: Añade withFetch()
    provideHttpClient(withInterceptors([jwtInterceptor]), withFetch()),
    provideAnimationsAsync(),
    importProvidersFrom(ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule)
  ]
};