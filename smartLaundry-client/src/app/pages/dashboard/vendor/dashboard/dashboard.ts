import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Notification {
  id: string;
  type: 'new_order' | 'order_update' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  serviceType: string;
  totalAmount: number;
  requestDateTime: string;
  status: 'Pending' | 'Confirmed' | 'Picked Up' | 'In Progress' | 'Delivered' | 'Completed' | 'Cancelled';
  driverId: string;
  items: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  service: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
}

export interface EarningsData {
  totalEarnings: number;
  pendingPayments: number;
  completedPayments: number;
  weeklyData: { day: string; earnings: number }[];
  monthlyData: { month: string; earnings: number }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe]
})
export class DashboardComponent implements OnInit {
  // Notifications
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;

  // Orders
  orders: Order[] = [];
  pendingOrders: Order[] = [];
  confirmedOrders: Order[] = [];
  completedOrders: Order[] = [];

  // Payments
  earningsData: EarningsData = {
    totalEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0,
    weeklyData: [],
    monthlyData: []
  };

  // UI State
  loading = true;
  activeTab: 'pending' | 'confirmed' | 'completed' = 'pending';
  tabs: ('pending' | 'confirmed' | 'completed')[] = ['pending', 'confirmed', 'completed'];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;
      const driverId = this.getDriverId();

      await Promise.all([
        this.loadNotifications(driverId),
        this.loadOrders(driverId),
        this.loadEarningsData(driverId)
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadNotifications(driverId: string): Promise<void> {
    try {
      // Mock notifications data
      this.notifications = [
        {
          id: '1',
          type: 'new_order',
          title: 'New Order Assignment',
          message: 'You have been assigned a new laundry order from John Kamau',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
          read: false,
          orderId: 'ORD001'
        },
        {
          id: '2',
          type: 'order_update',
          title: 'Order Status Updated',
          message: 'Order #ORD002 has been marked as completed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
          orderId: 'ORD002'
        },
        {
          id: '3',
          type: 'payment',
          title: 'Payment Received',
          message: 'KES 1,500 payment received for Order #ORD003',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true,
          orderId: 'ORD003'
        }
      ];

      this.unreadCount = this.notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  async loadOrders(driverId: string): Promise<void> {
    try {
      // Mock orders data
      this.orders = [
        {
          id: 'ORD001',
          customerName: 'John Kamau',
          customerPhone: '+254712345678',
          pickupAddress: '123 Main Street, Westlands, Nairobi',
          deliveryAddress: '456 Riverside Drive, Nairobi',
          serviceType: 'Premium Wash & Iron',
          totalAmount: 1200,
          requestDateTime: new Date().toISOString(),
          status: 'Pending',
          driverId: driverId,
          items: [
            { name: 'Shirts', quantity: 5, price: 500, service: 'Wash & Iron' },
            { name: 'Trousers', quantity: 3, price: 450, service: 'Wash & Iron' },
            { name: 'Jacket', quantity: 1, price: 250, service: 'Dry Clean' }
          ]
        },
        {
          id: 'ORD002',
          customerName: 'Sarah Mwangi',
          customerPhone: '+254723456789',
          pickupAddress: '789 Thika Road, Kasarani',
          deliveryAddress: '321 Mombasa Road, Nairobi',
          serviceType: 'Express Dry Cleaning',
          totalAmount: 850,
          requestDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'Confirmed',
          driverId: driverId,
          items: [
            { name: 'Office Suit', quantity: 1, price: 600, service: 'Dry Clean' },
            { name: 'Winter Coat', quantity: 1, price: 250, service: 'Dry Clean' }
          ]
        },
        {
          id: 'ORD003',
          customerName: 'Mike Ochieng',
          customerPhone: '+254734567890',
          pickupAddress: '555 Langata Road, Nairobi',
          deliveryAddress: '777 Ngong Road, Nairobi',
          serviceType: 'Standard Wash',
          totalAmount: 700,
          requestDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'Completed',
          driverId: driverId,
          items: [
            { name: 'Bed Sheets', quantity: 2, price: 300, service: 'Wash & Fold' },
            { name: 'Towels', quantity: 4, price: 400, service: 'Wash & Fold' }
          ]
        },
        {
          id: 'ORD004',
          customerName: 'Grace Wanjiku',
          customerPhone: '+254745678901',
          pickupAddress: '888 Kileleshwa, Nairobi',
          deliveryAddress: '999 Lavington, Nairobi',
          serviceType: 'Ironing Only',
          totalAmount: 450,
          requestDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'Pending',
          driverId: driverId,
          items: [
            { name: 'Dresses', quantity: 3, price: 300, service: 'Ironing' },
            { name: 'Blouses', quantity: 3, price: 150, service: 'Ironing' }
          ]
        }
      ];

      this.groupOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  groupOrders(): void {
    this.pendingOrders = this.orders.filter(order => order.status === 'Pending');
    this.confirmedOrders = this.orders.filter(order =>
      ['Confirmed', 'Picked Up', 'In Progress', 'Delivered'].includes(order.status)
    );
    this.completedOrders = this.orders.filter(order => order.status === 'Completed');
  }

  async loadEarningsData(driverId: string): Promise<void> {
    try {
      // Mock earnings data
      this.earningsData = {
        totalEarnings: 12500,
        pendingPayments: 2300,
        completedPayments: 10200,
        weeklyData: [
          { day: 'Mon', earnings: 1800 },
          { day: 'Tue', earnings: 2200 },
          { day: 'Wed', earnings: 1900 },
          { day: 'Thu', earnings: 2100 },
          { day: 'Fri', earnings: 2500 },
          { day: 'Sat', earnings: 2000 },
          { day: 'Sun', earnings: 0 }
        ],
        monthlyData: [
          { month: 'Jan', earnings: 45000 },
          { month: 'Feb', earnings: 52000 },
          { month: 'Mar', earnings: 48000 },
          { month: 'Apr', earnings: 55000 }
        ]
      };
    } catch (error) {
      console.error('Error loading earnings data:', error);
    }
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.markAllAsRead();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    this.unreadCount = 0;
  }

  // Order methods
  acceptOrder(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Confirmed';
      this.groupOrders();
      // In real app: this.http.patch(`/api/orders/${orderId}`, { status: 'Confirmed' })
    }
  }

  rejectOrder(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Cancelled';
      this.groupOrders();
      // In real app: this.http.patch(`/api/orders/${orderId}`, { status: 'Cancelled' })
    }
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.groupOrders();
      // In real app: this.http.patch(`/api/orders/${orderId}`, { status: newStatus })
    }
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
      'Picked Up': 'bg-purple-100 text-purple-800 border-purple-300',
      'In Progress': 'bg-orange-100 text-orange-800 border-orange-300',
      'Delivered': 'bg-green-100 text-green-800 border-green-300',
      'Completed': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status];
  }

  getStatusIcon(status: Order['status']): string {
    const icons = {
      'Pending': '⏳',
      'Confirmed': '✅',
      'Picked Up': '📦',
      'In Progress': '🧺',
      'Delivered': '🚚',
      'Completed': '🎉',
      'Cancelled': '❌'
    };
    return icons[status];
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(dateTime: string): string {
    const now = new Date();
    const time = new Date(dateTime);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  getDriverId(): string {
    return localStorage.getItem('driverId') || 'driver-123';
  }

  // Navigation
  navigateToOrderDetails(orderId: string): void {
    this.router.navigate(['/driver/orders', orderId]);
  }
}
