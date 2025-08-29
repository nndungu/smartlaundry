import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  }
];