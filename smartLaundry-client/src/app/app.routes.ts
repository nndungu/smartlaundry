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

   //Removed about page route
  // {path: 'about',
    // loadComponent: () => import('./pages/about/about').then(m => m.AboutComponent)},

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

  // CLIENT DASHBOARD ROUTES
  {
    path: 'client-dashboard',
    loadComponent: () => import('./pages/dashboard/client/client-dashboard').then(m => m.ClientDashboardComponent)
  },
  {
    path: 'client-dashboard/book-service',
    loadComponent: () => import('./pages/dashboard/client/book-service/book-service').then(m => m.BookServiceComponent)
  },
  {
    path: 'client-dashboard/order-tracking',
    loadComponent: () => import('./pages/dashboard/client/order-tracking/order-tracking').then(m => m.OrderTrackingComponent)
  },
  {
    path: 'client-dashboard/order-history',
    loadComponent: () => import('./pages/dashboard/client/order-history/order-history').then(m => m.OrderHistoryComponent)
  },
  {
    path: 'client-dashboard/payment-checkout',
    loadComponent: () => import('./pages/dashboard/client/payment-checkout/payment-checkout').then(m => m.PaymentCheckoutComponent)
  },
  {
    path: 'client-dashboard/notifications',
    loadComponent: () => import('./pages/dashboard/client/notifications/notifications').then(m => m.NotificationsComponent)
  },
  {
    path: 'client-dashboard/profile-update',
    loadComponent: () => import('./pages/dashboard/client/profile-update/profile-update').then(m => m.ProfileUpdateComponent)
  },
  {
    path: 'client',
    redirectTo: 'client-dashboard',
    pathMatch: 'full'
  },

  // VENDOR DASHBOARD ROUTES
  {
    path: 'vendor-dashboard',
    loadComponent: () => import('./pages/dashboard/vendor/vendor-dashboard').then(m => m.VendorDashboardComponent),
    children: [
      { path: 'orders', loadComponent: () => import('./pages/dashboard/vendor/order-status/order-status').then(m => m.OrderStatusComponent) },
      { path: 'profile', loadComponent: () => import('./pages/dashboard/vendor/profile/profile').then(m => m.ProfileComponent) },
      { path: 'payments', loadComponent: () => import('./pages/dashboard/vendor/payments/payments').then(m => m.PaymentsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'vendor',
    redirectTo: 'vendor-dashboard',
    pathMatch: 'full'
  },

  // Fallback route
  { path: '**', redirectTo: '/home' }
];