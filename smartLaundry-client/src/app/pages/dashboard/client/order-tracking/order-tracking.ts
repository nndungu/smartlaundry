import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';

export interface OrderStatus {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
  estimatedTime?: string;
}

export interface LaundryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  packageName: string;
  totalAmount: number;
  currency: string;
  orderDate: string;
  pickupAddress: string;
  deliveryAddress: string;
  specialInstructions?: string;
  currentStatus: string;
  estimatedDelivery: string;
  driverName?: string;
  driverPhone?: string;
  items: LaundryItem[];
  statusHistory: OrderStatus[];
  tracking: {
    pickup: TrackingInfo;
    processing: TrackingInfo;
    delivery: TrackingInfo;
  };
}

export interface LaundryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  condition: string;
  notes?: string;
}

export interface TrackingInfo {
  status: 'pending' | 'in-progress' | 'completed';
  startTime?: string;
  completedTime?: string;
  location?: string;
  notes?: string;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DecimalPipe],
  templateUrl: './order-tracking.html',
  styleUrls: ['./order-tracking.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {

  trackingForm!: FormGroup;
  currentOrder: LaundryOrder | null = null;
  isLoading = false;
  errorMessage = '';
  autoRefreshSubscription?: Subscription;
  autoRefreshEnabled = true;

  // Mock data for demonstration
  private mockOrders: LaundryOrder[] = [
    {
      id: 'SL-2024-001',
      customerName: 'John Doe',
      customerPhone: '+254700123456',
      customerEmail: 'john.doe@email.com',
      packageName: 'Family Package',
      totalAmount: 2200,
      currency: 'KSh',
      orderDate: '2024-01-15T10:30:00Z',
      pickupAddress: '123 Westlands Avenue, Nairobi',
      deliveryAddress: '123 Westlands Avenue, Nairobi',
      specialInstructions: 'Please handle delicate items with care',
      currentStatus: 'processing',
      estimatedDelivery: '2024-01-15T18:00:00Z',
      driverName: 'Peter Kamau',
      driverPhone: '+254701234567',
      items: [
        { id: '1', name: 'Cotton Shirts', quantity: 5, category: 'Shirts', condition: 'Good' },
        { id: '2', name: 'Jeans', quantity: 3, category: 'Pants', condition: 'Stained', notes: 'Oil stain on front' },
        { id: '3', name: 'Bed Sheets', quantity: 2, category: 'Bedding', condition: 'Good' },
        { id: '4', name: 'Towels', quantity: 4, category: 'Towels', condition: 'Good' }
      ],
      statusHistory: [
        {
          id: '1',
          title: 'Order Placed',
          description: 'Your order has been received and confirmed',
          icon: '📋',
          completed: true,
          active: false,
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Pickup Scheduled',
          description: 'Driver assigned and pickup scheduled',
          icon: '📅',
          completed: true,
          active: false,
          timestamp: '2024-01-15T10:45:00Z'
        },
        {
          id: '3',
          title: 'Items Collected',
          description: 'Your laundry has been picked up successfully',
          icon: '🚚',
          completed: true,
          active: false,
          timestamp: '2024-01-15T12:00:00Z'
        },
        {
          id: '4',
          title: 'Processing',
          description: 'Your items are being washed and cleaned',
          icon: '🧼',
          completed: false,
          active: true,
          estimatedTime: 'Estimated completion: 4:00 PM'
        },
        {
          id: '5',
          title: 'Quality Check',
          description: 'Items are being inspected and folded',
          icon: '✅',
          completed: false,
          active: false
        },
        {
          id: '6',
          title: 'Out for Delivery',
          description: 'Your clean laundry is on the way',
          icon: '🚛',
          completed: false,
          active: false
        },
        {
          id: '7',
          title: 'Delivered',
          description: 'Order completed successfully',
          icon: '🏠',
          completed: false,
          active: false
        }
      ],
      tracking: {
        pickup: {
          status: 'completed',
          startTime: '2024-01-15T11:30:00Z',
          completedTime: '2024-01-15T12:00:00Z',
          location: '123 Westlands Avenue, Nairobi'
        },
        processing: {
          status: 'in-progress',
          startTime: '2024-01-15T12:30:00Z',
          location: 'Smart Laundry Processing Center - Westlands'
        },
        delivery: {
          status: 'pending'
        }
      }
    },
    {
      id: 'SL-2024-002',
      customerName: 'Jane Smith',
      customerPhone: '+254711223344',
      customerEmail: 'jane.smith@email.com',
      packageName: 'Premium Package',
      totalAmount: 3000,
      currency: 'KSh',
      orderDate: '2024-01-14T14:15:00Z',
      pickupAddress: '456 Karen Road, Nairobi',
      deliveryAddress: '456 Karen Road, Nairobi',
      currentStatus: 'delivered',
      estimatedDelivery: '2024-01-14T20:00:00Z',
      driverName: 'Mary Wanjiku',
      driverPhone: '+254722334455',
      items: [
        { id: '1', name: 'Silk Blouses', quantity: 3, category: 'Delicate', condition: 'Good' },
        { id: '2', name: 'Wool Suits', quantity: 2, category: 'Formal', condition: 'Good' },
        { id: '3', name: 'Leather Jacket', quantity: 1, category: 'Leather', condition: 'Good' }
      ],
      statusHistory: [
        {
          id: '1',
          title: 'Order Placed',
          description: 'Your order has been received and confirmed',
          icon: '📋',
          completed: true,
          active: false,
          timestamp: '2024-01-14T14:15:00Z'
        },
        {
          id: '2',
          title: 'Pickup Scheduled',
          description: 'Driver assigned and pickup scheduled',
          icon: '📅',
          completed: true,
          active: false,
          timestamp: '2024-01-14T14:30:00Z'
        },
        {
          id: '3',
          title: 'Items Collected',
          description: 'Your laundry has been picked up successfully',
          icon: '🚚',
          completed: true,
          active: false,
          timestamp: '2024-01-14T16:00:00Z'
        },
        {
          id: '4',
          title: 'Processing',
          description: 'Your items are being washed and cleaned',
          icon: '🧼',
          completed: true,
          active: false,
          timestamp: '2024-01-14T17:30:00Z'
        },
        {
          id: '5',
          title: 'Quality Check',
          description: 'Items are being inspected and folded',
          icon: '✅',
          completed: true,
          active: false,
          timestamp: '2024-01-14T19:00:00Z'
        },
        {
          id: '6',
          title: 'Out for Delivery',
          description: 'Your clean laundry is on the way',
          icon: '🚛',
          completed: true,
          active: false,
          timestamp: '2024-01-14T19:30:00Z'
        },
        {
          id: '7',
          title: 'Delivered',
          description: 'Order completed successfully',
          icon: '🏠',
          completed: true,
          active: false,
          timestamp: '2024-01-14T20:15:00Z'
        }
      ],
      tracking: {
        pickup: {
          status: 'completed',
          startTime: '2024-01-14T15:30:00Z',
          completedTime: '2024-01-14T16:00:00Z',
          location: '456 Karen Road, Nairobi'
        },
        processing: {
          status: 'completed',
          startTime: '2024-01-14T16:30:00Z',
          completedTime: '2024-01-14T19:00:00Z',
          location: 'Smart Laundry Processing Center - Karen'
        },
        delivery: {
          status: 'completed',
          startTime: '2024-01-14T19:30:00Z',
          completedTime: '2024-01-14T20:15:00Z',
          location: '456 Karen Road, Nairobi'
        }
      }
    }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  private initializeForm(): void {
    this.trackingForm = this.formBuilder.group({
      trackingId: ['', [Validators.required, Validators.pattern(/^SL-\d{4}-\d{3}$/)]]
    });
  }

  trackOrder(): void {
    if (this.trackingForm.valid) {
      const trackingId = this.trackingForm.get('trackingId')?.value;
      this.searchOrder(trackingId);
    } else {
      this.markFormGroupTouched();
    }
  }

  private searchOrder(trackingId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.currentOrder = null;

    // Simulate API call delay
    setTimeout(() => {
      const order = this.mockOrders.find(o => o.id === trackingId);
      
      if (order) {
        this.currentOrder = { ...order };
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Order not found. Please check your tracking ID and try again.';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.trackingForm.controls).forEach(key => {
      const control = this.trackingForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  refreshOrder(): void {
    if (this.currentOrder) {
      this.searchOrder(this.currentOrder.id);
    }
  }

  clearSearch(): void {
    this.currentOrder = null;
    this.errorMessage = '';
    this.trackingForm.reset();
  }

  private startAutoRefresh(): void {
    if (this.autoRefreshEnabled) {
      this.autoRefreshSubscription = interval(30000).subscribe(() => {
        if (this.currentOrder && this.currentOrder.currentStatus !== 'delivered') {
          this.refreshOrder();
        }
      });
    }
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    
    if (this.autoRefreshEnabled) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  getStatusProgress(): number {
    if (!this.currentOrder) return 0;
    
    const completedSteps = this.currentOrder.statusHistory.filter(status => status.completed).length;
    const totalSteps = this.currentOrder.statusHistory.length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': '⏳',
      'confirmed': '✅',
      'pickup': '🚚',
      'processing': '🧼',
      'quality-check': '✅',
      'delivery': '🚛',
      'delivered': '🏠',
      'completed': '✅'
    };
    return iconMap[status] || '📋';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': '#fbbf24',
      'confirmed': '#10b981',
      'pickup': '#3b82f6',
      'processing': '#8b5cf6',
      'quality-check': '#06b6d4',
      'delivery': '#f59e0b',
      'delivered': '#10b981',
      'completed': '#10b981'
    };
    return colorMap[status] || '#6b7280';
  }

  callDriver(): void {
    if (this.currentOrder?.driverPhone) {
      window.open(`tel:${this.currentOrder.driverPhone}`, '_self');
    }
  }

  contactSupport(): void {
    // Implement contact support functionality
    window.open('tel:+254116174326', '_self');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.trackingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.trackingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Tracking ID is required';
      if (field.errors['pattern']) return 'Please enter a valid tracking ID (e.g., SL-2024-001)';
    }
    return '';
  }

  trackByStatusId(index: number, item: OrderStatus): string {
    return item.id;
  }

  trackByItemId(index: number, item: LaundryItem): string {
    return item.id;
  }
}