import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { Subscription } from 'rxjs';

export interface Order {
  id: string;
  service: string;
  date: string;
  status: string;
  statusClass: string;
  total: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  notificationCount = 0;
  userName = 'User';
  private userSubscription: Subscription = new Subscription();

  navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: '📊', active: true },
    { id: 'book-service', text: 'Book Service', icon: '🛒', active: false },
    { id: 'order-tracking', text: 'Order Tracking', icon: '📱', active: false },
    { id: 'order-history', text: 'Order History', icon: '📜', active: false },
    { id: 'payments', text: 'Payments', icon: '💳', active: false },
    { id: 'notifications', text: 'Notifications', icon: '🔔', active: false },
    { id: 'profile', text: 'Profile', icon: '👤', active: false }
  ];

  orderTableData: Order[] = [];

  constructor(@Inject(Router) private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user && user.firstName && user.lastName) {
        this.userName = `${user.firstName} ${user.lastName}`;
      } else {
        this.userName = 'User';
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

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
    let route = '';
    switch(pageId) {
      case 'dashboard':
        route = '/client-dashboard';
        break;
      case 'book-service':
        route = '/client-dashboard/book-service';
        break;
      case 'order-tracking':
        route = '/client-dashboard/order-tracking';
        break;
      case 'order-history':
        route = '/order-history';
        break;
      case 'payments':
        route = '/payments';
        break;
      case 'notifications':
        route = '/notifications';
        break;
      case 'profile':
        route = '/profile';
        break;
      default:
        route = '/client-dashboard';
    }
    this.router.navigate([route]);
    console.log('Navigate to:', route);
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
  currentOrderProgress = {
    placed: { completed: false, time: '' },
    pickup: { completed: false, time: '' },
    cleaning: { active: false, completed: false, time: '' },
    delivery: { active: false, completed: false, time: '' },
    completed: { completed: false, time: '' }
  };
}
