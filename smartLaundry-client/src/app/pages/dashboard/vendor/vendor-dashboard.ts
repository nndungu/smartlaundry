import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: number;
  customer: string;
  service: string;
  pickup: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Picked' | 'In Progress' | 'Delivered' | 'Completed';
  isNew?: boolean;
}

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VendorDashboardComponent implements OnInit {
  orders: Order[] = [
    { id: 101, customer: 'Alice Johnson', service: 'Wash & Fold', pickup: '2025-09-12 09:30', status: 'Pending', isNew: true },
    { id: 102, customer: 'Brian Smith', service: 'Dry Cleaning', pickup: '2025-09-12 13:00', status: 'Accepted' },
    { id: 103, customer: 'Carol Davis', service: 'Iron Only', pickup: '2025-09-12 15:45', status: 'In Progress' },
    { id: 104, customer: 'David Wilson', service: 'Wash & Iron', pickup: '2025-09-11 14:20', status: 'Delivered' },
    { id: 105, customer: 'Emma Brown', service: 'Dry Cleaning', pickup: '2025-09-11 11:00', status: 'Completed' },
    { id: 106, customer: 'Frank Miller', service: 'Wash & Fold', pickup: '2025-09-12 16:30', status: 'Pending', isNew: true }
  ];

  showConfirmModal = false;
  confirmAction: 'accept' | 'reject' | null = null;
  selectedOrderId: number | null = null;
  showToast = false;
  toastMessage = '';
  newOrdersCount = 0;
  showNotifications = false;

  statusOptions = ['Picked', 'In Progress', 'Delivered', 'Completed'];

  ngOnInit(): void {
    this.updateNewOrdersCount();
    // Simulate new orders coming in
    this.simulateNewOrders();
  }

  updateNewOrdersCount(): void {
    this.newOrdersCount = this.orders.filter(order => order.isNew).length;
  }

  simulateNewOrders(): void {
    // Simulate a new order arriving after 10 seconds
    setTimeout(() => {
      const newOrder: Order = {
        id: 107,
        customer: 'Grace Wilson',
        service: 'Express Wash',
        pickup: '2025-09-12 18:00',
        status: 'Pending',
        isNew: true
      };
      this.orders.unshift(newOrder);
      this.updateNewOrdersCount();
      this.showToastMessage('New order received!');
    }, 10000);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // Mark notifications as viewed after 2 seconds
      setTimeout(() => {
        this.orders.forEach(order => {
          if (order.isNew) order.isNew = false;
        });
        this.updateNewOrdersCount();
      }, 2000);
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Pending': 'bg-orange-100 text-orange-800',
      'Accepted': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Picked': 'bg-purple-100 text-purple-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  showConfirmation(action: 'accept' | 'reject', orderId: number): void {
    this.confirmAction = action;
    this.selectedOrderId = orderId;
    this.showConfirmModal = true;
  }

  confirmDecision(): void {
    if (this.selectedOrderId && this.confirmAction) {
      const order = this.orders.find(o => o.id === this.selectedOrderId);
      if (order) {
        order.status = this.confirmAction === 'accept' ? 'Accepted' : 'Rejected';
        order.isNew = false;
        this.showToastMessage(`Order ${this.confirmAction === 'accept' ? 'accepted' : 'rejected'} successfully`);
      }
      // TODO: API call to update order status
      // this.orderService.updateOrderStatus(this.selectedOrderId, order.status)
    }
    this.closeModal();
    this.updateNewOrdersCount();
  }

  closeModal(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.selectedOrderId = null;
  }

  updateOrderStatus(orderId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      const newStatus = target.value;
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus as Order['status'];
        this.showToastMessage(`Order status updated to ${newStatus}`);
      }
      // TODO: API call to update order status
      // this.orderService.updateOrderStatus(orderId, newStatus)
    }
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  isPending(status: string): boolean {
    return status === 'Pending';
  }

  isAccepted(status: string): boolean {
    return status === 'Accepted';
  }

  canChangeStatus(status: string): boolean {
    return ['Accepted', 'Picked', 'In Progress', 'Delivered'].includes(status);
  }

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }
}