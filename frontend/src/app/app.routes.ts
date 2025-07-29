// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
// CORRECCIÓN AQUÍ:
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'notes',
    // Y AQUÍ:
    component: NotesDashboardComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];