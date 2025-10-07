import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderStatusComponent, Order } from './order-status.component';

describe('OrderStatusComponent', () => {
  let component: OrderStatusComponent;
  let fixture: ComponentFixture<OrderStatusComponent>;
  let httpMock: HttpTestingController;

  const mockOrders: Order[] = [
    {
      id: '1',
      customerName: 'John Doe',
      pickupAddress: '123 Main St, Nairobi',
      deliveryAddress: '456 Elm St, Nairobi',
      serviceType: 'Wash & Fold',
      requestDateTime: '2024-01-15T10:30:00Z',
      status: 'Pending',
      driverId: 'driver-123'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      pickupAddress: '789 Oak St, Nairobi',
      deliveryAddress: '321 Pine St, Nairobi',
      serviceType: 'Wash, Iron & Fold',
      requestDateTime: '2024-01-15T14:45:00Z',
      status: 'Confirmed',
      driverId: 'driver-123'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderStatusComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('driver-123');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/orders?driverId=driver-123');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);

    tick();

    expect(component.orders).toEqual(mockOrders);
    expect(component.filteredOrders).toEqual(mockOrders);
    expect(component.loading).toBeFalse();
  }));

  it('should handle order loading error', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/orders?driverId=driver-123');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(component.error).toBe('Failed to load orders. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should filter orders correctly', () => {
    component.orders = mockOrders;

    component.applyFilter('pending');
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('Pending');

    component.applyFilter('active');
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('Confirmed');

    component.applyFilter('completed');
    expect(component.filteredOrders.length).toBe(0);

    component.applyFilter('all');
    expect(component.filteredOrders.length).toBe(2);
  });

  it('should confirm order successfully', fakeAsync(() => {
    component.orders = mockOrders;
    const orderId = '1';

    component.confirmOrder(orderId);

    const req = httpMock.expectOne(`/api/orders/${orderId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Confirmed' });

    const updatedOrder = { ...mockOrders[0], status: 'Confirmed' as const };
    req.flush(updatedOrder);

    tick();

    expect(component.orders[0].status).toBe('Confirmed');
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toBe('Order confirmed successfully!');
  }));

  it('should reject order successfully', fakeAsync(() => {
    component.orders = mockOrders;
    const orderId = '1';

    component.rejectOrder(orderId);

    const req = httpMock.expectOne(`/api/orders/${orderId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Rejected' });

    const updatedOrder = { ...mockOrders[0], status: 'Rejected' as const };
    req.flush(updatedOrder);

    tick();

    expect(component.orders[0].status).toBe('Rejected');
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toBe('Order rejected successfully!');
  }));

  it('should complete order successfully', fakeAsync(() => {
    component.orders = [mockOrders[1]]; // Start with confirmed order
    const orderId = '2';

    component.completeOrder(orderId);

    const req = httpMock.expectOne(`/api/orders/${orderId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Completed' });

    const updatedOrder = { ...mockOrders[1], status: 'Completed' as const };
    req.flush(updatedOrder);

    tick();

    expect(component.orders[0].status).toBe('Completed');
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toBe('Order marked as completed!');
  }));

  it('should handle order update error', fakeAsync(() => {
    component.orders = mockOrders;
    const orderId = '1';

    component.confirmOrder(orderId);

    const req = httpMock.expectOne(`/api/orders/${orderId}`);
    req.error(new ErrorEvent('Update failed'));

    tick();

    expect(component.showToast).toBeTrue();
    expect(component.toastType).toBe('error');
    expect(component.toastMessage).toBe('Failed to update order. Please try again.');
  }));

  it('should return correct status colors', () => {
    expect(component.getStatusColor('Pending')).toContain('yellow');
    expect(component.getStatusColor('Confirmed')).toContain('blue');
    expect(component.getStatusColor('Completed')).toContain('green');
    expect(component.getStatusColor('Rejected')).toContain('red');
  });

  it('should return correct status icons', () => {
    expect(component.getStatusIcon('Pending')).toBe('⏳');
    expect(component.getStatusIcon('Confirmed')).toBe('✅');
    expect(component.getStatusIcon('Completed')).toBe('🎉');
    expect(component.getStatusIcon('Rejected')).toBe('❌');
  });

  it('should check action permissions correctly', () => {
    const pendingOrder = mockOrders[0]; // Pending
    const confirmedOrder = mockOrders[1]; // Confirmed

    expect(component.canConfirm(pendingOrder)).toBeTrue();
    expect(component.canReject(pendingOrder)).toBeTrue();
    expect(component.canComplete(pendingOrder)).toBeFalse();

    expect(component.canConfirm(confirmedOrder)).toBeFalse();
    expect(component.canReject(confirmedOrder)).toBeFalse();
    expect(component.canComplete(confirmedOrder)).toBeTrue();
  });

  it('should format date time correctly', () => {
    const dateTime = '2024-01-15T10:30:00Z';
    const formatted = component.formatDateTime(dateTime);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('Jan');
  });

  it('should show toast message and auto hide', fakeAsync(() => {
    component.showToastMessage('Test message', 'success');
    
    expect(component.showToast).toBeTrue();
    expect(component.toastMessage).toBe('Test message');
    expect(component.toastType).toBe('success');

    tick(3000);

    expect(component.showToast).toBeFalse();
  }));
});