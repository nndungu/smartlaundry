// src/app/pages/dashboard/client/client-dashboard.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable, Subscription, interval, of } from 'rxjs';

// Local type definitions
enum OrderStatus {
  PLACED = 'PLACED',
  PICKED_UP = 'PICKED_UP',
  CLEANING = 'CLEANING',
  DELIVERY = 'DELIVERY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum ServiceType {
  WASH_FOLD = 'wash-fold',
  DRY_CLEANING = 'dry-cleaning',
  PREMIUM_LAUNDRY = 'premium-laundry',
  EXPRESS_LAUNDRY = 'express-laundry',
  STAIN_TREATMENT = 'stain-treatment',
  HOUSEHOLD = 'household',
  SHOE_CLEANING = 'shoe-cleaning'
}

interface Order {
  id: string;
  service: ServiceType;
  date: string;
  status: OrderStatus;
  total: number;
  currency: string;
  specialInstructions?: string;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalSpent: number;
  currency: string;
}

// Local interfaces for this component
interface ProgressStep {
  label: string;
  completed: boolean;
  current?: boolean;
  time?: string;
  icon?: string;
}

interface QuickStats {
  totalOrders: number;
  activeOrders: number;
  monthlySpent: string;
  nextPickup: string;
}

interface OrderTableData {
  id: string;
  service: string;
  date: string;
  status: string;
  total: string;
  statusClass: string;
}

interface NavItem {
  id: string;
  icon: string;
  text: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  // User data
  userName: string = 'Loading...';
  fullUserName: string = 'Loading...';
  userEmail: string = 'Loading...';
  userAvatar: string = '--';

  // Dashboard data
  dashboardStats$: Observable<DashboardStats> | undefined;
  recentOrders$: Observable<Order[]> | undefined;
  
  // Component state
  currentOrderId: string = '#1235';
  notificationCount: number = 3;
  isLoading: boolean = true;
  isMobileMenuOpen: boolean = false;
  
  // Quick stats
  quickStats: QuickStats = {
    totalOrders: 0,
    activeOrders: 0,
    monthlySpent: 'KES 0',
    nextPickup: '--'
  };

  // Order table data
  orderTableData: OrderTableData[] = [];

  // Current order tracking
  currentOrderProgress = {
    placed: { completed: true, time: 'Sep 5, 9:00 AM', active: false },
    pickup: { completed: true, time: 'Sep 5, 2:30 PM', active: false },
    cleaning: { completed: false, time: 'In Progress', active: true },
    delivery: { completed: false, time: 'Pending', active: false },
    completed: { completed: false, time: 'Pending', active: false }
  };

  // Navigation items
  navItems: NavItem[] = [
    { id: 'home', icon: '🏠', text: 'Home', route: '/client-dashboard', active: true },
    { id: 'book-service', icon: '🛒', text: 'Book Service', route: '/client-dashboard/book-service', active: false },
    { id: 'order-tracking', icon: '📱', text: 'Order Tracking', route: '/client-dashboard/order-tracking', active: false },
    { id: 'order-history', icon: '📋', text: 'Order History', route: '/client-dashboard/order-history', active: false },
    { id: 'payments', icon: '💳', text: 'Payments', route: '/client-dashboard/payment-checkout', active: false },
    { id: 'notifications', icon: '🔔', text: 'Notifications', route: '/client-dashboard/notifications', active: false },
    { id: 'profile', icon: '👤', text: 'Profile', route: '/client-dashboard/profile-update', active: false }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
    this.setupAutoRefresh();
    setTimeout(() => this.hideLoadingOverlay(), 1500);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData(): void {
    // Mock user data for now - you can replace with actual auth service
    this.userName = 'John';
    this.fullUserName = 'John Doe';
    this.userEmail = 'john.doe@example.com';
    this.userAvatar = this.getInitials(this.fullUserName);
  }

  private loadDashboardData(): void {
    // Load dashboard statistics with mock data
    const mockStats: DashboardStats = {
      totalOrders: 12,
      pendingOrders: 3,
      totalSpent: 4500,
      currency: 'KES'
    };

    this.quickStats = {
      totalOrders: mockStats.totalOrders,
      activeOrders: mockStats.pendingOrders,
      monthlySpent: `${mockStats.currency} ${mockStats.totalSpent}`,
      nextPickup: this.calculateNextPickup()
    };

    // Load recent orders with mock data
    const mockOrders: Order[] = [
      {
        id: '#1235',
        service: ServiceType.WASH_FOLD,
        date: '2024-01-15',
        status: OrderStatus.CLEANING,
        total: 1200,
        currency: 'KES',
        specialInstructions: 'Handle with care'
      },
      {
        id: '#1234',
        service: ServiceType.DRY_CLEANING,
        date: '2024-01-14',
        status: OrderStatus.COMPLETED,
        total: 800,
        currency: 'KES'
      },
      {
        id: '#1233',
        service: ServiceType.PREMIUM_LAUNDRY,
        date: '2024-01-13',
        status: OrderStatus.DELIVERY,
        total: 1500,
        currency: 'KES'
      }
    ];

    this.orderTableData = mockOrders.slice(0, 5).map((order: Order) => ({
      id: order.id,
      service: this.formatServiceName(order.service),
      date: this.formatDate(order.date),
      status: this.getStatusLabel(order.status),
      total: `${order.currency} ${order.total}`,
      statusClass: this.getStatusClass(order.status)
    }));

    // Update current order tracking if there's an active order
    const activeOrder = mockOrders.find((order: Order) => order.status !== OrderStatus.COMPLETED);
    if (activeOrder) {
      this.currentOrderId = activeOrder.id;
      this.updateOrderProgress(activeOrder.status);
    }
  }

  private setupAutoRefresh(): void {
    // Refresh data every 30 seconds
    const refreshSubscription = interval(30000).subscribe(() => {
      this.loadDashboardData();
    });
    this.subscriptions.push(refreshSubscription);
  }

  private hideLoadingOverlay(): void {
    this.isLoading = false;
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public navigateToPage(pageId: string): void {
    // Update active state
    this.navItems.forEach(item => {
      item.active = item.id === pageId;
    });

    // Navigate to route
    const navItem = this.navItems.find(item => item.id === pageId);
    if (navItem && navItem.route) {
      this.router.navigate([navItem.route]);
    }

    // Close mobile menu
    this.isMobileMenuOpen = false;
  }

  public handleSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    
    if (query.length > 2) {
      console.log('Searching for:', query);
      // Implement search functionality here
    }
  }

  public openNotifications(): void {
    this.router.navigate(['/client-dashboard/notifications']);
  }

  public openProfile(): void {
    this.router.navigate(['/client-dashboard/profile-update']);
  }

  public openSupport(): void {
    console.log('Opening support...');
    // Implement support functionality
  }

  public viewOrderDetails(orderId: string): void {
    // Mock order data for demonstration
    const mockOrder: Order = {
      id: orderId,
      service: ServiceType.WASH_FOLD,
      date: '2024-01-15',
      status: OrderStatus.CLEANING,
      total: 1200,
      currency: 'KES',
      specialInstructions: 'Handle with care'
    };

    this.showOrderModal(mockOrder);
  }

  private showOrderModal(order: Order): void {
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    if (modal && modalBody && modalTitle) {
      modalTitle.textContent = `Order ${order.id} Details`;
      modalBody.innerHTML = `
        <div class="order-details">
          <p><strong>Service:</strong> ${this.formatServiceName(order.service)}</p>
          <p><strong>Date:</strong> ${this.formatDate(order.date)}</p>
          <p><strong>Status:</strong> ${this.getStatusLabel(order.status)}</p>
          <p><strong>Total:</strong> ${order.currency} ${order.total}</p>
          ${order.specialInstructions ? `<p><strong>Instructions:</strong> ${order.specialInstructions}</p>` : ''}
        </div>
      `;
      modal.style.display = 'flex';
    }
  }

  public closeModal(): void {
    const modal = document.getElementById('orderModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private updateOrderProgress(status: OrderStatus): void {
    // Reset all steps
    Object.keys(this.currentOrderProgress).forEach(key => {
      this.currentOrderProgress[key as keyof typeof this.currentOrderProgress].active = false;
    });

    // Update progress based on current status
    switch (status) {
      case OrderStatus.PLACED:
        this.currentOrderProgress.placed.completed = true;
        break;
      case OrderStatus.PICKED_UP:
        this.currentOrderProgress.placed.completed = true;
        this.currentOrderProgress.pickup.completed = true;
        break;
      case OrderStatus.CLEANING:
        this.currentOrderProgress.placed.completed = true;
        this.currentOrderProgress.pickup.completed = true;
        this.currentOrderProgress.cleaning.active = true;
        break;
      case OrderStatus.DELIVERY:
        this.currentOrderProgress.placed.completed = true;
        this.currentOrderProgress.pickup.completed = true;
        this.currentOrderProgress.cleaning.completed = true;
        this.currentOrderProgress.delivery.active = true;
        break;
      case OrderStatus.COMPLETED:
        Object.keys(this.currentOrderProgress).forEach(key => {
          this.currentOrderProgress[key as keyof typeof this.currentOrderProgress].completed = true;
        });
        break;
    }
  }

  // Utility methods
  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  }

  private formatServiceName(service: ServiceType): string {
    return service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  private getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PLACED]: 'Order Placed',
      [OrderStatus.PICKED_UP]: 'Picked Up',
      [OrderStatus.CLEANING]: 'In Progress',
      [OrderStatus.DELIVERY]: 'Out for Delivery',
      [OrderStatus.COMPLETED]: 'Completed',
      [OrderStatus.CANCELLED]: 'Cancelled'
    };
    return labels[status] || status;
  }

  private getStatusClass(status: OrderStatus): string {
    const classes: Record<OrderStatus, string> = {
      [OrderStatus.PLACED]: 'status-placed',
      [OrderStatus.PICKED_UP]: 'status-pickup',
      [OrderStatus.CLEANING]: 'status-progress',
      [OrderStatus.DELIVERY]: 'status-delivery',
      [OrderStatus.COMPLETED]: 'status-completed',
      [OrderStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status] || 'status-default';
  }

  private calculateNextPickup(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}