import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },

  {path: 'home',
     loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)},

  // Removed about page route
  // {path: 'about',
  //    loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent)},

  {path: 'services',
     loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent)},

  {path: 'pricing',
     loadComponent: () => import('./pages/prices/prices').then(m => m.PricingComponent)},

  {path: 'contact',
     loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent)},

  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },

  {
    path: 'orders',
    loadComponent: () => import('./pages/dashboard/vendor/order-status/order-status').then(m => m.OrderStatusComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/dashboard/vendor/profile/profile').then(m => m.ProfileComponent)
  },
  {
    path: 'payments',
    loadComponent: () => import('./pages/dashboard/vendor/payments/payments').then(m => m.PaymentsComponent)
  },
  {
    path: 'vendor-dashboard',
    loadComponent: () => import('./pages/dashboard/vendor/vendor-dashboard').then(m => m.VendorDashboardComponent)
  },
  {
    path: 'vendor',
    redirectTo: 'vendor-dashboard',
    pathMatch: 'full'
  }
    ]
