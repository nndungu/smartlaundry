// TypeScript for Vendor Orders Management
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

class VendorOrdersManager {
  private orders: VendorOrder[] = [];
  private filteredOrders: VendorOrder[] = [];
  private currentFilter: string = 'all';
  private currentOrderId: string | null = null;

  constructor() {
    this.initializeEventListeners();
    this.loadOrders();
    this.setupRealTimeUpdates();
  }

  private showModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  private hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  private showLoading(): void {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
      loading.classList.add('active');
    }
  }

  private hideLoading(): void {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
      loading.classList.remove('active');
    }
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;

    // Add close event
    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }

  private debounce(func: Function, wait: number) {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize all event listeners
  private initializeEventListeners(): void {
    this.setupNavigationEvents();
    this.setupSearchEvents();
    this.setupFilterTabs();
    this.setupModalEvents();
    this.setupActionEvents();
  }

  // Setup navigation events
  private setupNavigationEvents(): void {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (page) {
          this.navigateToPage(page);
        }
      });
    });
  }

  private navigateToPage(page: string): void {
    console.log(`Navigating to ${page}`);
    // In a real SPA, this would handle routing
    if (page === 'dashboard') {
      // Stay on the same page or implement dashboard logic here
      console.log('Already on dashboard page');
    } else if (page === 'profile') {
      window.location.href = 'profile.html';
    }
  }

  // Setup search events
  private setupSearchEvents(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce((e: Event) => {
        const target = e.target as HTMLInputElement;
        this.searchOrders(target.value);
      }, 300));
    }
  }

  // Setup filter tabs
  private setupFilterTabs(): void {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const status = target.getAttribute('data-status');
        if (status) {
          this.filterByStatus(status);
          this.updateActiveTab(target);
        }
      });
    });
  }

  // Setup modal events
  private setupModalEvents(): void {
    // Order details modal
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const modalClose = document.getElementById('modalClose');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const acceptOrderBtn = document.getElementById('acceptOrderBtn');
    const rejectOrderBtn = document.getElementById('rejectOrderBtn');

    if (modalClose) {
      modalClose.addEventListener('click', () => this.hideModal('orderDetailsModal'));
    }
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.hideModal('orderDetailsModal'));
    }
    if (acceptOrderBtn) {
      acceptOrderBtn.addEventListener('click', () => this.acceptOrder());
    }
    if (rejectOrderBtn) {
      rejectOrderBtn.addEventListener('click', () => this.openRejectionModal());
    }

    // Status update modal
    const statusUpdateModal = document.getElementById('statusUpdateModal');
    const statusModalClose = document.getElementById('statusModalClose');
    const cancelStatusBtn = document.getElementById('cancelStatusBtn');
    const confirmStatusBtn = document.getElementById('confirmStatusBtn');
    const newStatusSelect = document.getElementById('newStatus') as HTMLSelectElement;

    if (statusModalClose) {
      statusModalClose.addEventListener('click', () => this.hideModal('statusUpdateModal'));
    }
    if (cancelStatusBtn) {
      cancelStatusBtn.addEventListener('click', () => this.hideModal('statusUpdateModal'));
    }
    if (confirmStatusBtn) {
      confirmStatusBtn.addEventListener('click', () => this.confirmStatusUpdate());
    }
    if (newStatusSelect) {
      newStatusSelect.addEventListener('change', () => this.handleStatusChange());
    }

    // Rejection modal
    const rejectionModal = document.getElementById('rejectionModal');
    const rejectionModalClose = document.getElementById('rejectionModalClose');
    const cancelRejectionBtn = document.getElementById('cancelRejectionBtn');
    const confirmRejectionBtn = document.getElementById('confirmRejectionBtn');

    if (rejectionModalClose) {
      rejectionModalClose.addEventListener('click', () => this.hideModal('rejectionModal'));
    }
    if (cancelRejectionBtn) {
      cancelRejectionBtn.addEventListener('click', () => this.hideModal('rejectionModal'));
    }
    if (confirmRejectionBtn) {
      confirmRejectionBtn.addEventListener('click', () => this.confirmRejection());
    }
  }

  // Setup action events
  private setupActionEvents(): void {
    // Event delegation for dynamically created buttons
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('view-btn')) {
        const orderId = target.getAttribute('data-order-id');
        if (orderId) this.showOrderDetails(orderId);
      }
      
      if (target.classList.contains('status-btn')) {
        const orderId = target.getAttribute('data-order-id');
        if (orderId) this.openStatusUpdateModal(orderId);
      }
      
      if (target.classList.contains('reject-btn')) {
        const orderId = target.getAttribute('data-order-id');
        if (orderId) {
          this.currentOrderId = orderId;
          this.openRejectionModal();
        }
      }
    });
  }

  // Load orders from API
  private async loadOrders(): Promise<void> {
    try {
      this.showLoading();
      
      // Mock data - replace with actual API call
      const mockOrders = await this.fetchMockOrders();
      this.orders = mockOrders;
      this.filteredOrders = [...this.orders];
      
      this.renderOrders();
      this.updateStats();
      this.hideLoading();
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.showToast('Failed to load orders', 'error');
      this.hideLoading();
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
  private filterByStatus(status: string): void {
    this.currentFilter = status;
    
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
    
    this.renderOrders();
  }

  // Search orders
  private searchOrders(query: string): void {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
      this.filterByStatus(this.currentFilter);
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      order.id.toLowerCase().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.customerPhone.includes(searchTerm) ||
      order.service.toLowerCase().includes(searchTerm) ||
      order.pickupAddress.toLowerCase().includes(searchTerm)
    );
    
    this.renderOrders();
  }

  // Render orders table
  private renderOrders(): void {
    const tableBody = document.getElementById('ordersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tableBody || !emptyState) return;

    if (this.filteredOrders.length === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    tableBody.innerHTML = this.filteredOrders.map(order => this.renderOrderRow(order)).join('');
  }

  // Render individual order row
  private renderOrderRow(order: VendorOrder): string {
    const itemsText = Object.entries(order.items)
      .map(([item, count]) => `${count} ${item}`)
      .join(', ');

    return `
      <tr>
        <td class="order-id">#${order.id}</td>
        <td class="customer-name">${order.customerName}</td>
        <td>${order.service}</td>
        <td class="pickup-address" title="${order.pickupAddress}">${order.pickupAddress}</td>
        <td>
          <span class="status-badge ${order.status}">${this.formatStatus(order.status)}</span>
        </td>
        <td class="total-amount">KES ${order.totalAmount.toLocaleString()}</td>
        <td>
          <div class="actions">
            <button class="action-btn view-btn" data-order-id="${order.id}">
              👁️ View
            </button>
            ${order.status !== 'rejected' && order.status !== 'completed' ? `
              <button class="action-btn status-btn" data-order-id="${order.id}">
                🔄 Update
              </button>
            ` : ''}
            ${order.status === 'pending' ? `
              <button class="action-btn reject-btn" data-order-id="${order.id}">
                ❌ Reject
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }

  // Show order details modal
  private showOrderDetails(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    this.currentOrderId = orderId;
    const modalBody = document.getElementById('orderDetailsBody');
    if (!modalBody) return;

    const itemsList = Object.entries(order.items)
      .map(([item, count]) => `${count} ${item.charAt(0).toUpperCase() + item.slice(1)}`)
      .join(', ');

    modalBody.innerHTML = `
      <div class="order-details-grid">
        <div class="detail-item">
          <div class="label">Order ID</div>
          <div class="value">#${order.id}</div>
        </div>
        <div class="detail-item">
          <div class="label">Customer</div>
          <div class="value">${order.customerName}</div>
        </div>
        <div class="detail-item">
          <div class="label">Phone</div>
          <div class="value">${order.customerPhone}</div>
        </div>
        <div class="detail-item">
          <div class="label">Service</div>
          <div class="value">${order.service}</div>
        </div>
        <div class="detail-item">
          <div class="label">Items</div>
          <div class="value">${itemsList}</div>
        </div>
        <div class="detail-item">
          <div class="label">Total Amount</div>
          <div class="value">KES ${order.totalAmount.toLocaleString()}</div>
        </div>
      </div>
      
      <div style="margin: 20px 0;">
        <div class="label" style="margin-bottom: 8px;">Pickup Address</div>
        <div class="value">${order.pickupAddress}</div>
      </div>
      
      <div style="margin: 20px 0;">
        <div class="label" style="margin-bottom: 8px;">Delivery Address</div>
        <div class="value">${order.deliveryAddress}</div>
      </div>
      
      ${order.specialInstructions ? `
        <div style="margin: 20px 0;">
          <div class="label" style="margin-bottom: 8px;">Special Instructions</div>
          <div class="value">${order.specialInstructions}</div>
        </div>
      ` : ''}
      
      <div style="margin: 20px 0;">
        <div class="label" style="margin-bottom: 8px;">Status History</div>
        <div class="status-history">
          ${order.statusHistory.map(history => `
            <div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
              <strong>${this.formatStatus(history.status)}</strong> - ${this.formatDateTime(history.timestamp)}
              ${history.notes ? `<br><small>${history.notes}</small>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.showModal('orderDetailsModal');
  }

  // Show status update modal
  private openStatusUpdateModal(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    this.currentOrderId = orderId;
    
    const currentStatusDisplay = document.getElementById('currentStatusDisplay');
    if (currentStatusDisplay) {
      currentStatusDisplay.innerHTML = `
        <div class="status-label">Current Status</div>
        <div class="status-value">${this.formatStatus(order.status)}</div>
      `;
    }

    // Update available status options based on current status
    this.updateStatusOptions(order.status);
    this.showModal('statusUpdateModal');
  }

  // Update available status options
  private updateStatusOptions(currentStatus: string): void {
    const newStatusSelect = document.getElementById('newStatus') as HTMLSelectElement;
    if (!newStatusSelect) return;

    // Define next possible statuses based on current status
    const statusFlow: { [key: string]: string[] } = {
      'pending': ['accepted'],
      'accepted': ['picked'],
      'picked': ['in-transit'],
      'in-transit': ['delivered'],
      'delivered': ['completed']
    };

    const availableStatuses = statusFlow[currentStatus] || [];
    
    newStatusSelect.innerHTML = '<option value="">Select New Status</option>' +
      availableStatuses.map(status => 
        `<option value="${status}">${this.formatStatus(status)}</option>`
      ).join('');
  }

  // Handle status change in modal
  private handleStatusChange(): void {
    const newStatusSelect = document.getElementById('newStatus') as HTMLSelectElement;
    const deliveryPhotoSection = document.getElementById('deliveryPhotoSection');
    
    if (newStatusSelect && deliveryPhotoSection) {
      // Show photo upload for delivery status
      if (newStatusSelect.value === 'delivered') {
        deliveryPhotoSection.style.display = 'block';
      } else {
        deliveryPhotoSection.style.display = 'none';
      }
    }
  }

  // Accept order
  private async acceptOrder(): Promise<void> {
    if (!this.currentOrderId) return;

    try {
      this.showLoading();
      
      // Simulate API call
      await this.updateOrderStatus(this.currentOrderId, 'accepted', 'Order accepted by rider');
      
      this.showToast('Order accepted successfully!', 'success');
      this.hideModal('orderDetailsModal');
      this.hideLoading();
    } catch (error) {
      this.showToast('Failed to accept order', 'error');
      this.hideLoading();
    }
  }

  // Show rejection modal
  private openRejectionModal(): void {
    this.showModal('rejectionModal');
  }

  // Confirm rejection
  private async confirmRejection(): Promise<void> {
    if (!this.currentOrderId) return;

    const rejectionReason = (document.getElementById('rejectionReason') as HTMLSelectElement).value;
    const rejectionNotes = (document.getElementById('rejectionNotes') as HTMLTextAreaElement).value;

    if (!rejectionReason) {
      this.showToast('Please select a rejection reason', 'error');
      return;
    }

    try {
      this.showLoading();
      
      // Update order with rejection
      await this.updateOrderStatus(this.currentOrderId, 'rejected', 
        `Rejected: ${rejectionReason}. ${rejectionNotes}`);
      
      // Update order object
      const order = this.orders.find(o => o.id === this.currentOrderId);
      if (order) {
        order.rejectionReason = rejectionReason;
      }

      this.showToast('Order rejected', 'success');
      this.hideModal('rejectionModal');
      this.hideModal('orderDetailsModal');
      this.hideLoading();
    } catch (error) {
      this.showToast('Failed to reject order', 'error');
      this.hideLoading();
    }
  }

  // Confirm status update
  private async confirmStatusUpdate(): Promise<void> {
    if (!this.currentOrderId) return;

    const newStatus = (document.getElementById('newStatus') as HTMLSelectElement).value;
    const statusNotes = (document.getElementById('statusNotes') as HTMLTextAreaElement).value;

    if (!newStatus) {
      this.showToast('Please select a new status', 'error');
      return;
    }

    try {
      this.showLoading();
      
      await this.updateOrderStatus(this.currentOrderId, newStatus as any, statusNotes);
      
      this.showToast('Order status updated successfully!', 'success');
      this.hideModal('statusUpdateModal');
      this.hideLoading();
    } catch (error) {
      this.showToast('Failed to update order status', 'error');
      this.hideLoading();
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
    const totalOrders = document.getElementById('totalOrders');
    const pendingOrders = document.getElementById('pendingOrders');
    const completedToday = document.getElementById('completedToday');

    if (totalOrders) totalOrders.textContent = this.orders.length.toString();
    
    if (pendingOrders) {
      const pending = this.orders.filter(o => o.status === 'pending').length;
      pendingOrders.textContent = pending.toString();
    }
    
    if (completedToday) {
      const today = new Date().toDateString();
      const completedTodayCount = this.orders.filter(o => 
        o.status === 'completed' && 
        new Date(o.statusHistory[o.statusHistory.length - 1]?.timestamp || '').toDateString() === today
      ).length;
      completedToday.textContent = completedTodayCount.toString();
    }
  }

  // Setup real-time updates
  private setupRealTimeUpdates(): void {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      // In a real app, this would check for new orders from the server
      console.log('Checking for order updates...');
    }, 30000);
  }

  // Utility methods
  private updateActiveTab(activeTab: HTMLElement): void {
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
  }

  private formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  }

  private formatDateTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-KE');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const vendorOrders = new VendorOrdersManager();
    console.log('Vendor Orders Manager initialized');
    
    // Make available globally for debugging
    (window as any).vendorOrders = vendorOrders;
  } catch (error) {
    console.error('Failed to initialize Vendor Orders Manager:', error);
  }
});

export { VendorOrdersManager };
