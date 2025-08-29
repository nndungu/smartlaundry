export const routes: Routes = [];
>>>>>>> de38134 ( initialized client folder)
=======
export const routes: Routes = [];
=======
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
>>>>>>> ad3b78e (create register page)
>>>>>>> da8259f (create register page)
=======
import { Routes } from '@angular/router';

<<<<<<< HEAD
export const routes: Routes = [];
=======
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
>>>>>>> ad3b78e (create register page)
