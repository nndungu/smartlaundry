// TypeScript interfaces for Client Dashboard (Angular Compatible)
interface ClientOrder {
  id: string;
  service: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  total: number;
  items?: string[];
  pickupAddress?: string;
  deliveryAddress?: string;
}

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface DashboardData {
  currentOrder?: ClientOrder;
  recentOrders: ClientOrder[];
  progressSteps: ProgressStep[];
}

// Client Dashboard Class (Angular Compatible)
export class ClientDashboard {
  private orders: ClientOrder[] = [];
  private currentOrder: ClientOrder | null = null;
  private progressSteps: ProgressStep[] = [];

  constructor() {
    this.initializeData();
    this.initializeEventListeners();
    this.renderDashboard();
  }

  // Initialize dashboard data
  private initializeData(): void {
    // Initialize progress steps
    this.progressSteps = [
      { id: 'placed', label: 'Order Placed', completed: true },
      { id: 'picked', label: 'Picked Up', completed: true },
      { id: 'cleaning', label: 'Cleaning', completed: false, current: true },
      { id: 'delivery', label: 'Delivery', completed: false },
      { id: 'completed', label: 'Completed', completed: false }
    ];

    // Sample orders data matching your HTML
    this.orders = [
      {
        id: '1234',
        service: 'Wash & Fold',
        date: '2025-09-01',
        status: 'completed',
        total: 500,
        items: ['2 Shirts', '1 Trouser'],
        pickupAddress: '123 Main St, Nairobi'
      },
      {
        id: '1235',
        service: 'Dry Cleaning',
        date: '2025-09-05',
        status: 'in-progress',
        total: 800,
        items: ['1 Suit', '2 Dresses'],
        pickupAddress: '456 Oak Ave, Nairobi'
      }
    ];

    // Set current order (in-progress order)
    this.currentOrder = this.orders.find(order => order.status === 'in-progress') || null;
  }

  // Initialize all event listeners
  private initializeEventListeners(): void {
    this.setupNavigationEvents();
    this.setupSearchEvents();
    this.setupHeaderEvents();
    this.setupOrderTableEvents();
    this.setupKeyboardShortcuts();
  }

  // Setup navigation events
  private setupNavigationEvents(): void {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(item as HTMLElement);
      });
    });
  }

  // Handle navigation between sections
  private handleNavigation(clickedItem: HTMLElement): void {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to clicked item
    clickedItem.classList.add('active');

    // Get the page from data attribute
    const page = clickedItem.getAttribute('data-page') || 
                 clickedItem.querySelector('.nav-text')?.textContent?.trim();
    
    if (page) {
      this.navigateToPage(page);
    }
  }

  // Navigate to different pages/sections
  private navigateToPage(page: string): void {
    console.log(`Navigating to: ${page}`);
    
    switch (page.toLowerCase().replace(' ', '-')) {
      case 'dashboard':
        this.showDashboardSection();
        break;
      case 'book-service':
        this.navigateToBookService();
        break;
      case 'my-orders':
        this.showOrdersSection();
        break;
      case 'order-tracking':
        this.showTrackingSection();
        break;
      case 'order-history':
        this.showHistorySection();
        break;
      case 'payments':
        this.showPaymentsSection();
        break;
      case 'notifications':
        this.showNotificationsSection();
        break;
      case 'profile':
        this.showProfileSection();
        break;
      default:
        console.log('Unknown page:', page);
    }
  }

  // Setup search functionality
  private setupSearchEvents(): void {
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.handleSearch(target.value);
      });
    }
  }

  // Handle search functionality
  private handleSearch(searchTerm: string): void {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    if (normalizedTerm === '') {
      this.showAllOrders();
      return;
    }

    // Filter orders based on search term
    const filteredOrders = this.orders.filter(order => 
      order.id.toLowerCase().includes(normalizedTerm) ||
      order.service.toLowerCase().includes(normalizedTerm) ||
      order.status.toLowerCase().includes(normalizedTerm)
    );

    this.updateOrderTable(filteredOrders);
    console.log(`Search results for "${searchTerm}": ${filteredOrders.length} orders found`);
  }

  // Show all orders
  private showAllOrders(): void {
    this.updateOrderTable(this.orders);
  }

  // Setup header events
  private setupHeaderEvents(): void {
    const notificationBtn = document.getElementById('notificationBtn');
    const profileBtn = document.getElementById('profileBtn');

    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        this.showNotifications();
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.showProfile();
      });
    }
  }

  // Setup order table events
  private setupOrderTableEvents(): void {
    const orderTable = document.getElementById('orderTable');
    
    if (orderTable) {
      orderTable.addEventListener('click', (e) => {
        const orderRow = (e.target as HTMLElement).closest('.order-row');
        if (orderRow) {
          const orderId = orderRow.getAttribute('data-order');
          if (orderId) {
            this.showOrderDetails(orderId);
          }
        }
      });
    }
  }

  // Setup keyboard shortcuts
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl + / to focus search
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Esc to clear search
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (document.activeElement === searchInput && searchInput && searchInput.value) {
          searchInput.value = '';
          this.showAllOrders();
        }
      }

      // Number keys for navigation (1-8 for menu items)
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const navItems = document.querySelectorAll('.nav-item');
        const index = parseInt(e.key) - 1;
        if (navItems[index]) {
          (navItems[index] as HTMLElement).click();
        }
      }
    });
  }

  // Render the dashboard
  private renderDashboard(): void {
    this.updateProgressTracker();
    this.updateOrderTable(this.orders);
    this.setupWelcomeMessage();
  }

  // Update progress tracker based on current order
  private updateProgressTracker(): void {
    const progressTracker = document.getElementById('progressTracker');
    if (!progressTracker) return;

    const progressSteps = progressTracker.querySelectorAll('.progress-step');
    
    // Update progress based on current order status
    if (this.currentOrder) {
      const currentSteps = this.getProgressForStatus(this.currentOrder.status);
      
      progressSteps.forEach((step, index) => {
        const circle = step.querySelector('.progress-circle');
        const line = step.querySelector('.progress-line');
        const icon = step.querySelector('.progress-icon') as HTMLElement;
        
        if (currentSteps[index]) {
          step.classList.add('completed');
          if (circle) circle.classList.add('completed');
          if (icon) icon.textContent = '✓';
          if (line) line.classList.add('completed');
        } else {
          step.classList.remove('completed');
          if (circle) circle.classList.remove('completed');
          if (icon) icon.textContent = '';
          if (line) line.classList.remove('completed');
        }

        // Mark current step
        if (currentSteps[index] === 'current') {
          step.classList.add('current');
          if (circle) circle.classList.add('current');
        } else {
          step.classList.remove('current');
          if (circle) circle.classList.remove('current');
        }
      });
    }
  }

  // Get progress steps for order status
  private getProgressForStatus(status: string): (boolean | string)[] {
    const progressMap: { [key: string]: (boolean | string)[] } = {
      'pending': [false, false, false, false, false],
      'confirmed': [true, false, false, false, false],
      'picked': [true, true, false, false, false],
      'in-progress': [true, true, 'current', false, false],
      'delivery': [true, true, true, 'current', false],
      'completed': [true, true, true, true, true]
    };

    return progressMap[status] || [true, true, 'current', false, false];
  }

  // Update order table
  private updateOrderTable(orders: ClientOrder[]): void {
    const tableBody = document.getElementById('orderTableBody');
    if (!tableBody) return;

    if (orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
            No orders found
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = orders.map(order => `
      <tr class="order-row" data-order="${order.id}">
        <td class="order-id">#${order.id}</td>
        <td class="service-type">${order.service}</td>
        <td class="order-date">${this.formatDate(order.date)}</td>
        <td class="order-status">
          <span class="status-badge ${order.status}">${this.formatStatus(order.status)}</span>
        </td>
        <td class="order-total">KES ${order.total.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  // Setup welcome message
  private setupWelcomeMessage(): void {
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    
    if (welcomeTitle && welcomeSubtitle) {
      // Get current time for appropriate greeting
      const currentHour = new Date().getHours();
      let greeting = 'Welcome Back';
      
      if (currentHour < 12) {
        greeting = 'Good Morning';
      } else if (currentHour < 17) {
        greeting = 'Good Afternoon';
      } else {
        greeting = 'Good Evening';
      }

      welcomeTitle.textContent = `${greeting} 👋`;
      
      // Update subtitle based on user activity
      const totalOrders = this.orders.length;
      const activeOrders = this.orders.filter(o => o.status === 'in-progress').length;
      
      if (activeOrders > 0) {
        welcomeSubtitle.textContent = `You have ${activeOrders} active order${activeOrders > 1 ? 's' : ''} in progress.`;
      } else {
        welcomeSubtitle.textContent = "Here's an overview of your laundry activity.";
      }
    }
  }

  // Show order details
  private showOrderDetails(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const details = `
Order Details:
--------------
Order ID: #${order.id}
Service: ${order.service}
Date: ${this.formatDate(order.date)}
Status: ${this.formatStatus(order.status)}
Total: KES ${order.total.toLocaleString()}

Items: ${order.items?.join(', ') || 'No items listed'}
Pickup Address: ${order.pickupAddress || 'Not specified'}
    `;

    alert(details);
  }

  // Navigation methods
  private showDashboardSection(): void {
    console.log('Showing Dashboard section');
  }

  private navigateToBookService(): void {
    console.log('Navigating to Book Service');
    alert('Book Service - Feature coming soon!\nYou can book new laundry services here.');
  }

  private showOrdersSection(): void {
    console.log('Showing My Orders section');
    const orderTable = document.getElementById('orderTable');
    if (orderTable) {
      orderTable.scrollIntoView({ behavior: 'smooth' });
    }
    alert('My Orders - Showing your current and recent orders.');
  }

  private showTrackingSection(): void {
    console.log('Showing Order Tracking section');
    const progressTracker = document.getElementById('progressTracker');
    if (progressTracker) {
      progressTracker.scrollIntoView({ behavior: 'smooth' });
    }
    alert('Order Tracking - Track your current order progress.');
  }

  private showHistorySection(): void {
    console.log('Showing Order History section');
    const historySection = document.querySelector('.history-section');
    if (historySection) {
      historySection.scrollIntoView({ behavior: 'smooth' });
    }
    alert('Order History - View all your past orders.');
  }

  private showPaymentsSection(): void {
    console.log('Showing Payments section');
    alert('Payments - Manage your payment methods and billing history.');
  }

  private showNotificationsSection(): void {
    console.log('Showing Notifications section');
    alert('Notifications - View your latest notifications and updates.');
  }

  private showProfileSection(): void {
    console.log('Showing Profile section');
    alert('Profile - Manage your account settings and personal information.');
  }

  // Header action methods
  private showNotifications(): void {
    const notifications = [
      'Order #1235 is being processed',
      'Your dry cleaning will be ready tomorrow',
      'New discount available: 15% off your next order'
    ];
    
    alert('Notifications:\n\n' + notifications.join('\n'));
  }

  private showProfile(): void {
    const profileOptions = [
      'View Profile',
      'Account Settings',
      'Addresses',
      'Payment Methods',
      'Help & Support',
      'Logout'
    ];
    
    alert('Profile Menu:\n\n' + profileOptions.join('\n'));
  }

  // Utility methods
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  }

  // Loading state management
  private showLoading(): void {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
  }

  private hideLoading(): void {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }

  // Public methods for external access
  public refreshData(): void {
    console.log('Refreshing dashboard data...');
    this.showLoading();
    
    // Simulate data refresh
    setTimeout(() => {
      this.initializeData();
      this.renderDashboard();
      this.hideLoading();
      console.log('Dashboard data refreshed');
    }, 1000);
  }

  public addOrder(order: ClientOrder): void {
    this.orders.unshift(order);
    this.updateOrderTable(this.orders);
    
    // Update current order if this is in-progress
    if (order.status === 'in-progress') {
      this.currentOrder = order;
      this.updateProgressTracker();
    }
  }

  public updateOrderStatus(orderId: string, newStatus: ClientOrder['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.updateOrderTable(this.orders);
      
      // Update progress tracker if this is the current order
      if (this.currentOrder?.id === orderId) {
        this.updateProgressTracker();
      }
    }
  }

  public getCurrentOrder(): ClientOrder | null {
    return this.currentOrder;
  }

  public getAllOrders(): ClientOrder[] {
    return [...this.orders];
  }
}

// Initialize the dashboard when DOM is loaded (Angular compatible)
declare const window: any;

document.addEventListener('DOMContentLoaded', () => {
  try {
    const clientDashboard = new ClientDashboard();
    
    // Make dashboard available globally for debugging
    window.clientDashboard = clientDashboard;
    
    console.log('Client Dashboard initialized successfully');
    
    // Auto-refresh every 30 seconds (for real-time updates)
    setInterval(() => {
      // Only refresh if there's an active order
      const currentOrder = clientDashboard.getCurrentOrder();
      if (currentOrder && currentOrder.status === 'in-progress') {
        console.log('Auto-refreshing for active order...');
        // In a real app, this would fetch fresh data from the server
      }
    }, 30000);
    
  } catch (error) {
    console.error('Failed to initialize Client Dashboard:', error);
    alert('Failed to load dashboard. Please refresh the page.');
  }
});

// Angular-compatible export
export default ClientDashboard;