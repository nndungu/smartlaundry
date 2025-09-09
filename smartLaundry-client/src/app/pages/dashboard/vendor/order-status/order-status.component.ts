import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VendorOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  service: string;
  status: 'pending' | 'accepted' | 'picked' | 'in-transit' | 'delivered' | 'completed' | 'rejected';
  pickupAddress: string;
  deliveryAddress: string;
  orderDate: string;
  requestedPickupTime: string;
  items: { [key: string]: number };
  totalAmount: number;
  specialInstructions?: string;
  rejectionReason?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.html',
  styleUrls: ['./order-status.scss'],
  imports: [CommonModule]
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  orders: VendorOrder[] = [];
  filteredOrders: VendorOrder[] = [];
  currentFilter: string = 'all';
  currentOrderId: string | null = null;
  searchQuery: string = '';

  // Modal states
  showOrderDetailsModal: boolean = false;
  showStatusUpdateModal: boolean = false;
  showRejectionModal: boolean = false;
  isLoading: boolean = false;

  // Current order for modals
  currentOrder: VendorOrder | null = null;

  // Form data
  newStatus: string = '';
  statusNotes: string = '';
  rejectionReason: string = '';
  rejectionNotes: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Load orders from API
  private async loadOrders(): Promise<void> {
    try {
      this.isLoading = true;

      // Mock data - replace with actual API call
      const mockOrders = await this.fetchMockOrders();
      this.orders = mockOrders;
      this.filteredOrders = [...this.orders];

      this.updateStats();
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.showToast('Failed to load orders', 'error');
      this.isLoading = false;
    }
  }

  // Fetch mock orders data
  private async fetchMockOrders(): Promise<VendorOrder[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: '1234',
        customerId: 'CUST001',
        customerName: 'Sarah Johnson',
        customerPhone: '+254701234567',
        service: 'Wash & Fold',
        status: 'pending',
        pickupAddress: '123 Westlands Ave, Nairobi',
        deliveryAddress: '123 Westlands Ave, Nairobi',
        orderDate: '2025-09-10T08:30:00Z',
        requestedPickupTime: '2025-09-12T09:00:00Z',
        items: { shirts: 3, trousers: 2 },
        totalAmount: 500,
        specialInstructions: 'Please handle with care',
        statusHistory: [
          { status: 'pending', timestamp: '2025-09-10T08:30:00Z' }
        ]
      },
      {
        id: '1235',
        customerId: 'CUST002',
        customerName: 'Michael Chen',
        customerPhone: '+254712345678',
        service: 'Dry Cleaning',
        status: 'accepted',
        pickupAddress: '456 Karen Road, Nairobi',
        deliveryAddress: '456 Karen Road, Nairobi',
        orderDate: '2025-09-09T14:20:00Z',
        requestedPickupTime: '2025-09-11T10:00:00Z',
        items: { suits: 2, jackets: 1 },
        totalAmount: 800,
        statusHistory: [
          { status: 'pending', timestamp: '2025-09-09T14:20:00Z' },
          { status: 'accepted', timestamp: '2025-09-09T15:00:00Z' }
        ]
      },
      {
        id: '1236',
        customerId: 'CUST003',
        customerName: 'Grace Wanjiku',
        customerPhone: '+254723456789',
        service: 'Premium Care',
        status: 'picked',
        pickupAddress: '789 Kilimani St, Nairobi',
        deliveryAddress: '789 Kilimani St, Nairobi',
        orderDate: '2025-09-08T11:10:00Z',
        requestedPickupTime: '2025-09-10T13:00:00Z',
        items: { dresses: 3, shirts: 2 },
        totalAmount: 600,
        statusHistory: [
          { status: 'pending', timestamp: '2025-09-08T11:10:00Z' },
          { status: 'accepted', timestamp: '2025-09-08T11:30:00Z' },
          { status: 'picked', timestamp: '2025-09-10T13:15:00Z', notes: 'Items collected successfully' }
        ]
      }
    ];
  }

  // Filter orders by status
  filterByStatus(status: string): void {
    this.currentFilter = status;

    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
  }

  // Search orders
  onSearchChange(query: string): void {
    this.searchQuery = query.toLowerCase().trim();

    if (this.searchQuery === '') {
      this.filterByStatus(this.currentFilter);
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      order.id.toLowerCase().includes(this.searchQuery) ||
      order.customerName.toLowerCase().includes(this.searchQuery) ||
      order.customerPhone.includes(this.searchQuery) ||
      order.service.toLowerCase().includes(this.searchQuery) ||
      order.pickupAddress.toLowerCase().includes(this.searchQuery)
    );
  }

  // Show order details modal
  showOrderDetails(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    this.currentOrder = order;
    this.currentOrderId = orderId;
    this.showOrderDetailsModal = true;
  }

  // Show status update modal
  openStatusUpdateModal(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    this.currentOrder = order;
    this.currentOrderId = orderId;
    this.newStatus = '';
    this.statusNotes = '';
    this.showStatusUpdateModal = true;
  }

  // Show rejection modal
  openRejectionModal(): void {
    this.rejectionReason = '';
    this.rejectionNotes = '';
    this.showRejectionModal = true;
  }

  // Accept order
  async acceptOrder(): Promise<void> {
    if (!this.currentOrderId) return;

    try {
      this.isLoading = true;

      // Simulate API call
      await this.updateOrderStatus(this.currentOrderId, 'accepted', 'Order accepted by rider');

      this.showToast('Order accepted successfully!', 'success');
      this.showOrderDetailsModal = false;
      this.isLoading = false;
    } catch (error) {
      this.showToast('Failed to accept order', 'error');
      this.isLoading = false;
    }
  }

  // Confirm rejection
  async confirmRejection(): Promise<void> {
    if (!this.currentOrderId) return;

    if (!this.rejectionReason) {
      this.showToast('Please select a rejection reason', 'error');
      return;
    }

    try {
      this.isLoading = true;

      // Update order with rejection
      await this.updateOrderStatus(this.currentOrderId, 'rejected',
        `Rejected: ${this.rejectionReason}. ${this.rejectionNotes}`);

      // Update order object
      const order = this.orders.find(o => o.id === this.currentOrderId);
      if (order) {
        order.rejectionReason = this.rejectionReason;
      }

      this.showToast('Order rejected', 'success');
      this.showRejectionModal = false;
      this.showOrderDetailsModal = false;
      this.isLoading = false;
    } catch (error) {
      this.showToast('Failed to reject order', 'error');
      this.isLoading = false;
    }
  }

  // Confirm status update
  async confirmStatusUpdate(): Promise<void> {
    if (!this.currentOrderId) return;

    if (!this.newStatus) {
      this.showToast('Please select a new status', 'error');
      return;
    }

    try {
      this.isLoading = true;

      await this.updateOrderStatus(this.currentOrderId, this.newStatus as any, this.statusNotes);

      this.showToast('Order status updated successfully!', 'success');
      this.showStatusUpdateModal = false;
      this.isLoading = false;
    } catch (error) {
      this.showToast('Failed to update order status', 'error');
      this.isLoading = false;
    }
  }

  // Update order status
  private async updateOrderStatus(orderId: string, newStatus: VendorOrder['status'], notes?: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        notes
      });
    }

    this.filterByStatus(this.currentFilter);
    this.updateStats();
  }

  // Update statistics
  private updateStats(): void {
    // Stats will be calculated in template
  }

  // Utility methods
  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  }

  formatDateTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-KE');
  }

  getItemsText(order: VendorOrder): string {
    return Object.entries(order.items)
      .map(([item, count]) => `${count} ${item}`)
      .join(', ');
  }

  getStatusOptions(currentStatus: string): string[] {
    const statusFlow: { [key: string]: string[] } = {
      'pending': ['accepted'],
      'accepted': ['picked'],
      'picked': ['in-transit'],
      'in-transit': ['delivered'],
      'delivered': ['completed']
    };

    return statusFlow[currentStatus] || [];
  }

  // Modal controls
  closeOrderDetailsModal(): void {
    this.showOrderDetailsModal = false;
  }

  closeStatusUpdateModal(): void {
    this.showStatusUpdateModal = false;
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
  }

  // Toast notification
  private showToast(message: string, type: 'success' | 'error'): void {
    // For now, just console.log - you can implement a proper toast service
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  // Computed properties for stats
  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  get completedToday(): number {
    const today = new Date().toDateString();
    return this.orders.filter(o =>
      o.status === 'completed' &&
      new Date(o.statusHistory[o.statusHistory.length - 1]?.timestamp || '').toDateString() === today
    ).length;
  }
}
