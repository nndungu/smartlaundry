import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DriverDashboardComponent, Notification, Order, EarningsData } from './dashboard.component';
import { Chart } from 'chart.js';

describe('DriverDashboardComponent', () => {
  let component: DriverDashboardComponent;
  let fixture: ComponentFixture<DriverDashboardComponent>;
  let httpMock: HttpTestingController;

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_order',
      title: 'New Order Assignment',
      message: 'You have been assigned a new laundry order',
      timestamp: new Date().toISOString(),
      read: false,
      orderId: 'ORD001'
    }
  ];

  const mockOrders: Order[] = [
    {
      id: 'ORD001',
      customerName: 'John Kamau',
      customerPhone: '+254712345678',
      pickupAddress: '123 Main Street, Nairobi',
      deliveryAddress: '456 Riverside Drive, Nairobi',
      serviceType: 'Premium Wash & Iron',
      totalAmount: 1200,
      requestDateTime: new Date().toISOString(),
      status: 'Pending',
      driverId: 'driver-123',
      items: [
        { name: 'Shirts', quantity: 5, price: 500, service: 'Wash & Iron' }
      ]
    }
  ];

  const mockEarningsData: EarningsData = {
    totalEarnings: 12500,
    pendingPayments: 2300,
    completedPayments: 10200,
    weeklyData: [
      { day: 'Mon', earnings: 1800 },
      { day: 'Tue', earnings: 2200 }
    ],
    monthlyData: [
      { month: 'Jan', earnings: 45000 },
      { month: 'Feb', earnings: 52000 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverDashboardComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('driver-123');
  });

  afterEach(() => {
    httpMock.verify();
    if (component.chart) {
      component.chart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', fakeAsync(() => {
    component.ngOnInit();

    // Since we're using mock data directly, we don't need to expect HTTP calls
    // But we can verify the loading state and data assignment
    expect(component.loading).toBeTrue();

    tick();

    expect(component.orders.length).toBeGreaterThan(0);
    expect(component.notifications.length).toBeGreaterThan(0);
    expect(component.earningsData.totalEarnings).toBe(12500);
    expect(component.loading).toBeFalse();
  }));

  it('should group orders correctly', () => {
    component.orders = mockOrders;
    component.groupOrders();

    expect(component.pendingOrders.length).toBe(1);
    expect(component.pendingOrders[0].status).toBe('Pending');
    expect(component.confirmedOrders.length).toBe(0);
    expect(component.completedOrders.length).toBe(0);
  });

  it('should toggle notifications dropdown', () => {
    component.notifications = mockNotifications;
    component.unreadCount = 1;

    component.toggleNotifications();
    expect(component.showNotifications).toBeTrue();
    expect(component.unreadCount).toBe(0); // Should mark as read when opened

    component.toggleNotifications();
    expect(component.showNotifications).toBeFalse();
  });

  it('should mark all notifications as read', () => {
    component.notifications = mockNotifications;
    component.unreadCount = 1;

    component.markAllAsRead();

    expect(component.notifications.every(n => n.read)).toBeTrue();
    expect(component.unreadCount).toBe(0);
  });

  it('should accept an order', () => {
    component.orders = [...mockOrders];
    const orderId = 'ORD001';

    component.acceptOrder(orderId);

    const updatedOrder = component.orders.find(o => o.id === orderId);
    expect(updatedOrder?.status).toBe('Confirmed');
  });

  it('should reject an order', () => {
    component.orders = [...mockOrders];
    const orderId = 'ORD001';

    component.rejectOrder(orderId);

    const updatedOrder = component.orders.find(o => o.id === orderId);
    expect(updatedOrder?.status).toBe('Cancelled');
  });

  it('should update order status', () => {
    component.orders = [...mockOrders];
    const orderId = 'ORD001';

    component.updateOrderStatus(orderId, 'Picked Up');

    const updatedOrder = component.orders.find(o => o.id === orderId);
    expect(updatedOrder?.status).toBe('Picked Up');
  });

  it('should return correct status colors', () => {
    expect(component.getStatusColor('Pending')).toContain('yellow');
    expect(component.getStatusColor('Confirmed')).toContain('blue');
    expect(component.getStatusColor('Picked Up')).toContain('purple');
    expect(component.getStatusColor('Completed')).toContain('green');
    expect(component.getStatusColor('Cancelled')).toContain('red');
  });

  it('should return correct status icons', () => {
    expect(component.getStatusIcon('Pending')).toBe('⏳');
    expect(component.getStatusIcon('Confirmed')).toBe('✅');
    expect(component.getStatusIcon('Picked Up')).toBe('📦');
    expect(component.getStatusIcon('In Progress')).toBe('🧺');
    expect(component.getStatusIcon('Delivered')).toBe('🚚');
  });

  it('should format date time correctly', () => {
    const dateTime = '2024-01-15T10:30:00Z';
    const formatted = component.formatDateTime(dateTime);
    
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  it('should calculate time ago correctly', () => {
    const now = new Date();
    const oneMinAgo = new Date(now.getTime() - 60 * 1000).toISOString();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    expect(component.getTimeAgo(oneMinAgo)).toContain('m ago');
    expect(component.getTimeAgo(oneHourAgo)).toContain('h ago');
    expect(component.getTimeAgo(oneDayAgo)).toContain('d ago');
  });

  it('should get driver ID from localStorage', () => {
    const driverId = component.getDriverId();
    expect(driverId).toBe('driver-123');
  });

  it('should initialize earnings chart', () => {
    component.earningsData = mockEarningsData;
    
    // Mock canvas context
    const mockContext = {
      canvas: {
        style: {}
      }
    } as CanvasRenderingContext2D;
    
    spyOn(document, 'getElementById').and.returnValue({
      getContext: () => mockContext
    } as any);

    component.initEarningsChart();

    expect(component.chart).toBeDefined();
    expect(component.chart.config.type).toBe('bar');
  });

  it('should clean up chart on destroy', () => {
    // Create a mock chart
    const mockChart = {
      destroy: jasmine.createSpy('destroy')
    };
    component.chart = mockChart as any;

    component.ngOnDestroy();

    expect(mockChart.destroy).toHaveBeenCalled();
  });

  it('should handle empty orders state', () => {
    component.orders = [];
    component.groupOrders();

    expect(component.pendingOrders.length).toBe(0);
    expect(component.confirmedOrders.length).toBe(0);
    expect(component.completedOrders.length).toBe(0);
  });

  it('should handle notification toggle with no unread', () => {
    component.notifications = mockNotifications.map(n => ({ ...n, read: true }));
    component.unreadCount = 0;

    component.toggleNotifications();

    expect(component.showNotifications).toBeTrue();
    expect(component.unreadCount).toBe(0);
  });

  it('should not update non-existent order', () => {
    component.orders = [...mockOrders];
    const initialStatus = component.orders[0].status;

    component.updateOrderStatus('NON_EXISTENT', 'Completed');

    expect(component.orders[0].status).toBe(initialStatus);
  });

  it('should return correct time ago for just now', () => {
    const justNow = new Date().toISOString();
    expect(component.getTimeAgo(justNow)).toBe('Just now');
  });

  it('should apply filter correctly', () => {
    component.orders = [
      { ...mockOrders[0], status: 'Pending' },
      { ...mockOrders[0], id: 'ORD002', status: 'Confirmed' },
      { ...mockOrders[0], id: 'ORD003', status: 'Completed' }
    ];

    component.applyFilter('pending');
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('Pending');

    component.applyFilter('confirmed');
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('Confirmed');

    component.applyFilter('completed');
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('Completed');

    component.applyFilter('all');
    expect(component.filteredOrders.length).toBe(3);
  });

  it('should handle chart initialization without canvas element', () => {
    component.earningsData = mockEarningsData;
    
    spyOn(document, 'getElementById').and.returnValue(null);
    
    // This should not throw an error
    expect(() => component.initEarningsChart()).not.toThrow();
  });
});