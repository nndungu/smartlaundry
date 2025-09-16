 import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.scss']
})
export class ClientDashboardComponent {
  isMobileMenuOpen = false;
  notificationCount = 0;
  userName = 'User';

  navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: '📊', active: true },
    { id: 'orders', text: 'Orders', icon: '📋', active: false },
    { id: 'profile', text: 'Profile', icon: '👤', active: false },
    { id: 'payments', text: 'Payments', icon: '💳', active: false }
  ];

  constructor(@Inject(Router) private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeModal(): void {
    // Implement modal close logic here
    console.log('Modal closed');
  }

  openNotifications(): void {
    // Implement notification open logic here
    console.log('Notifications opened');
  }

  openProfile(): void {
    // Implement profile open logic here
    console.log('Profile opened');
  }

  handleSearch(event: any): void {
    const searchTerm = event.target.value;
    // Implement search logic here
    console.log('Search term:', searchTerm);
  }

  navigateToPage(pageId: string): void {
    this.navItems.forEach(item => item.active = (item.id === pageId));
    // Implement navigation logic here
    console.log('Navigate to:', pageId);
  }

  openSupport(): void {
    // Implement support open logic here
    console.log('Support opened');
  }

  viewOrderDetails(orderId: string): void {
    // Implement order details view logic here
    console.log('View order details:', orderId);
  }

  isLoading = false;
  orderTableData = [];
  currentOrderProgress = {
    placed: { completed: false, time: '' },
    pickup: { completed: false, time: '' },
    cleaning: { active: false, completed: false, time: '' },
    delivery: { active: false, completed: false, time: '' },
    completed: { completed: false, time: '' }
  };
}
