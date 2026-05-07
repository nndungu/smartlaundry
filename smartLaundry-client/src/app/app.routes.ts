import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { clientGuard } from './core/guards/client-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // PUBLIC ROUTES
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'services', loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },

  // AUTH ROUTES
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },

  // CLIENT DASHBOARD ROUTES
  {
    path: 'client-dashboard',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./shared/components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/client/client-dashboard').then(m => m.ClientDashboardComponent) },
      { path: 'book-service', loadComponent: () => import('./pages/dashboard/client/book-service/book-service').then(m => m.BookingServiceComponent) },
      { path: 'cart', loadComponent: () => import('./pages/dashboard/client/cart/cart').then(m => m.CartComponent) },
      { path: 'order-tracking', loadComponent: () => import('./pages/dashboard/client/order-tracking/order-tracking').then(m => m.OrderTrackingComponent) },
      { path: 'order-history', loadComponent: () => import('./pages/dashboard/client/order-history/order-history').then(m => m.OrderHistoryComponent) },
      { path: 'payment-checkout', loadComponent: () => import('./pages/dashboard/client/payment-checkout/payment-checkout').then(m => m.CheckoutPaymentComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/dashboard/client/notifications/notifications').then(m => m.NotificationsComponent) },
      { path: 'profile-update', loadComponent: () => import('./pages/dashboard/client/profile-update/profile-update').then(m => m.ProfileUpdateComponent) }
    ]
  },
  { path: 'client', redirectTo: 'client-dashboard', pathMatch: 'full' },

  // ADMIN DASHBOARD ROUTES
  {
    path: 'admin-dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./shared/components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard/admin/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'manage-orders', loadComponent: () => import('./pages/dashboard/admin/manage-orders/manage-orders').then(m => m.ManageOrders) },
      { path: 'manage-users', loadComponent: () => import('./pages/dashboard/admin/manage-users/manage-users').then(m => m.ManageUsers) },
      { path: 'reports', loadComponent: () => import('./pages/dashboard/admin/reports/reports').then(m => m.Reports) },
      { path: 'settings', loadComponent: () => import('./pages/dashboard/admin/settings/settings').then(m => m.Settings) }
    ]
  },
  { path: 'admin', redirectTo: 'admin-dashboard', pathMatch: 'full' },

  // FALLBACK
  { path: '**', redirectTo: '/home' }
];