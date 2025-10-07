import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  serviceType: string;
  items: OrderItem[];
  totalAmount: number;
  requestDateTime: string;
  pickupDateTime?: string;
  deliveryDateTime?: string;
  status: 'Pending' | 'Assigned' | 'Picked Up' | 'In Progress' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  driverId: string;
  driverName?: string;
  specialInstructions?: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  service: string;
}

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.html',
  styleUrls: ['./order-status.scss']
})
export class OrderStatusComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  error = '';
  activeFilter: 'all' | 'active' | 'completed' | 'pending' = 'all';

  // Toast notifications
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDriverOrders();
  }

  async loadDriverOrders(): Promise<void> {
    try {
      this.loading = true;
      const driverId = localStorage.getItem('driverId') || 'current-driver';

      // Mock data with realistic order flow
      this.orders = [
        {
          id: 'ORD001',
          customerName: 'John Kamau',
          customerPhone: '+254712345678',
          pickupAddress: '123 Main Street, Westlands, Nairobi',
          deliveryAddress: '456 Riverside Drive, Nairobi',
          serviceType: 'Premium Wash',
          items: [
            { name: 'Shirts', quantity: 5, price: 400, service: 'Wash & Iron' },
            { name: 'Trousers', quantity: 3, price: 300, service: 'Wash & Iron' }
          ],
          totalAmount: 700,
          requestDateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'Assigned',
          driverId: driverId,
          driverName: 'You',
          specialInstructions: 'Call before pickup',
          estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ORD002',
          customerName: 'Sarah Mwangi',
          customerPhone: '+254723456789',
          pickupAddress: '789 Thika Road, Kasarani, Nairobi',
          deliveryAddress: '321 Mombasa Road, Nairobi',
          serviceType: 'Express Dry Cleaning',
          items: [
            { name: 'Winter Jacket', quantity: 1, price: 450, service: 'Dry Clean' },
            { name: 'Office Suit', quantity: 1, price: 600, service: 'Dry Clean' }
          ],
          totalAmount: 1050,
          requestDateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
          pickupDateTime: new Date().toISOString(),
          status: 'Picked Up',
          driverId: driverId,
          driverName: 'You',
          estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ORD003',
          customerName: 'Mike Ochieng',
          customerPhone: '+254734567890',
          pickupAddress: '555 Langata Road, Nairobi',
          deliveryAddress: '777 Ngong Road, Nairobi',
          serviceType: 'Standard Wash',
          items: [
            { name: 'Bed Sheets', quantity: 2, price: 300, service: 'Wash & Fold' },
            { name: 'Towels', quantity: 4, price: 400, service: 'Wash & Fold' }
          ],
          totalAmount: 700,
          requestDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          pickupDateTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          deliveryDateTime: new Date().toISOString(),
          status: 'Delivered',
          driverId: driverId,
          driverName: 'You'
        },
        {
          id: 'ORD004',
          customerName: 'Grace Wanjiku',
          customerPhone: '+254745678901',
          pickupAddress: '888 Kileleshwa, Nairobi',
          deliveryAddress: '999 Lavington, Nairobi',
          serviceType: 'Ironing Only',
          items: [
            { name: 'Dresses', quantity: 3, price: 450, service: 'Ironing' },
            { name: 'Blouses', quantity: 4, price: 400, service: 'Ironing' }
          ],
          totalAmount: 850,
          requestDateTime: new Date().toISOString(),
          status: 'Pending',
          driverId: driverId
        }
      ];
      this.applyFilter(this.activeFilter);
    } catch (error) {
      console.error('Error loading orders:', error);
      this.error = 'Failed to load orders. Please try again.';
      this.showToastMessage('Failed to load orders', 'error');
    } finally {
      this.loading = false;
    }
  }

  applyFilter(filter: 'all' | 'active' | 'completed' | 'pending'): void {
    this.activeFilter = filter;

    switch (filter) {
      case 'pending':
        this.filteredOrders = this.orders.filter(order => order.status === 'Pending');
        break;
      case 'active':
        this.filteredOrders = this.orders.filter(order => 
          ['Assigned', 'Picked Up', 'In Progress', 'Out for Delivery'].includes(order.status)
        );
        break;
      case 'completed':
        this.filteredOrders = this.orders.filter(order => order.status === 'Delivered');
        break;
      default:
        this.filteredOrders = [...this.orders];
    }
  }

  // Driver Actions
  async acceptOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'Assigned', 'Order accepted successfully!');
  }

  async markAsPickedUp(orderId: string): Promise<void> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.pickupDateTime = new Date().toISOString();
    }
    await this.updateOrderStatus(orderId, 'Picked Up', 'Order marked as picked up!');
  }

  async markAsInProgress(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'In Progress', 'Order marked as in progress!');
  }

  async markAsOutForDelivery(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'Out for Delivery', 'Order is out for delivery!');
  }

  async markAsDelivered(orderId: string): Promise<void> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.deliveryDateTime = new Date().toISOString();
    }
    await this.updateOrderStatus(orderId, 'Delivered', 'Order delivered successfully!');
  }

  async rejectOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'Cancelled', 'Order has been cancelled');
  }

  private async updateOrderStatus(orderId: string, status: Order['status'], successMessage: string): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = status;
        this.applyFilter(this.activeFilter);
      }

      this.showToastMessage(successMessage, 'success');
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      this.showToastMessage('Failed to update order. Please try again.', 'error');
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      'Pending': 'bg-gray-100 text-gray-800 border-gray-300',
      'Assigned': 'bg-blue-100 text-blue-800 border-blue-300',
      'Picked Up': 'bg-purple-100 text-purple-800 border-purple-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-300',
      'Delivered': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status];
  }

  getStatusIcon(status: Order['status']): string {
    const icons = {
      'Pending': '⏳',
      'Assigned': '📋',
      'Picked Up': '📦',
      'In Progress': '🧺',
      'Out for Delivery': '🚚',
      'Delivered': '✅',
      'Cancelled': '❌'
    };
    return icons[status];
  }

  // Action permissions
  canAccept(order: Order): boolean {
    return order.status === 'Pending';
  }

  canPickUp(order: Order): boolean {
    return order.status === 'Assigned';
  }

  canStartProgress(order: Order): boolean {
    return order.status === 'Picked Up';
  }

  canMarkForDelivery(order: Order): boolean {
    return order.status === 'In Progress';
  }

  canDeliver(order: Order): boolean {
    return order.status === 'Out for Delivery';
  }

  canReject(order: Order): boolean {
    return ['Pending', 'Assigned'].includes(order.status);
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('en-US', {
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
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getOrderCount(filter: string): number {
    switch (filter) {
      case 'pending':
        return this.orders.filter(order => order.status === 'Pending').length;
      case 'active':
        return this.orders.filter(order => 
          ['Assigned', 'Picked Up', 'In Progress', 'Out for Delivery'].includes(order.status)
        ).length;
      case 'completed':
        return this.orders.filter(order => order.status === 'Delivered').length;
      default:
        return this.orders.length;
    }
  }

  // Get next available action for an order
  getNextAction(order: Order): string {
    switch (order.status) {
      case 'Pending': return 'Accept Order';
      case 'Assigned': return 'Mark as Picked Up';
      case 'Picked Up': return 'Start Processing';
      case 'In Progress': return 'Mark for Delivery';
      case 'Out for Delivery': return 'Mark as Delivered';
      default: return 'Completed';
    }
  }

  // Calculate progress percentage for order timeline
  getOrderProgress(order: Order): number {
    const steps = ['Pending', 'Assigned', 'Picked Up', 'In Progress', 'Out for Delivery', 'Delivered'];
    const currentStep = steps.indexOf(order.status);
    return (currentStep / (steps.length - 1)) * 100;
  }
}