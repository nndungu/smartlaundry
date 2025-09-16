import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { OrderStatusComponent } from './order-status';

describe('OrderStatusComponent', () => {
  let component: OrderStatusComponent;
  let fixture: ComponentFixture<OrderStatusComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OrderStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with mock orders', () => {
    expect(component.orders).toBeDefined();
    expect(component.orders.length).toBeGreaterThan(0);
  });

  it('should calculate new orders count correctly', () => {
    component.orders = [
      { id: 1, customer: 'Test 1', service: 'Wash', pickup: '2025-09-12 09:30', status: 'Pending', isNew: true },
      { id: 2, customer: 'Test 2', service: 'Dry Clean', pickup: '2025-09-12 13:00', status: 'Accepted', isNew: false },
      { id: 3, customer: 'Test 3', service: 'Iron', pickup: '2025-09-12 15:45', status: 'Pending', isNew: true }
    ];
    
    component.updateNewOrdersCount();
    expect(component.newOrdersCount).toBe(2);
  });

  it('should display notification badge when there are new orders', () => {
    component.newOrdersCount = 3;
    fixture.detectChanges();
    
    const badge = compiled.querySelector('.animate-pulse');
    expect(badge).toBeTruthy();
    expect(badge?.textContent?.trim()).toBe('3');
  });

  it('should not display notification badge when no new orders', () => {
    component.newOrdersCount = 0;
    fixture.detectChanges();
    
    const badge = compiled.querySelector('.animate-pulse');
    expect(badge).toBeFalsy();
  });

  it('should toggle notifications dropdown', () => {
    expect(component.showNotifications).toBeFalsy();
    
    component.toggleNotifications();
    expect(component.showNotifications).toBeTruthy();
    
    component.toggleNotifications();
    expect(component.showNotifications).toBeFalsy();
  });

  it('should return correct CSS class for order status', () => {
    expect(component.getStatusClass('Pending')).toBe('bg-orange-100 text-orange-800');
    expect(component.getStatusClass('Accepted')).toBe('bg-blue-100 text-blue-800');
    expect(component.getStatusClass('Rejected')).toBe('bg-red-100 text-red-800');
    expect(component.getStatusClass('In Progress')).toBe('bg-yellow-100 text-yellow-800');
    expect(component.getStatusClass('Delivered')).toBe('bg-green-100 text-green-800');
    expect(component.getStatusClass('Completed')).toBe('bg-gray-100 text-gray-800');
  });

  it('should show confirmation modal for accept action', () => {
    component.showConfirmation('accept', 101);
    
    expect(component.showConfirmModal).toBeTruthy();
    expect(component.confirmAction).toBe('accept');
    expect(component.selectedOrderId).toBe(101);
  });

  it('should show confirmation modal for reject action', () => {
    component.showConfirmation('reject', 102);
    
    expect(component.showConfirmModal).toBeTruthy();
    expect(component.confirmAction).toBe('reject');
    expect(component.selectedOrderId).toBe(102);
  });

  it('should close confirmation modal', () => {
    component.showConfirmModal = true;
    component.confirmAction = 'accept';
    component.selectedOrderId = 101;
    
    component.closeModal();
    
    expect(component.showConfirmModal).toBeFalsy();
    expect(component.confirmAction).toBeNull();
    expect(component.selectedOrderId).toBeNull();
  });

  it('should confirm accept decision and update order status', () => {
    component.orders = [
      { id: 101, customer: 'Test User', service: 'Wash', pickup: '2025-09-12 09:30', status: 'Pending' }
    ];
    component.confirmAction = 'accept';
    component.selectedOrderId = 101;
    
    spyOn(component, 'showToastMessage');
    
    component.confirmDecision();
    
    const updatedOrder = component.orders.find(o => o.id === 101);
    expect(updatedOrder?.status).toBe('Accepted');
    expect(component.showToastMessage).toHaveBeenCalledWith('Order accepted successfully');
    expect(component.showConfirmModal).toBeFalsy();
  });

  it('should confirm reject decision and update order status', () => {
    component.orders = [
      { id: 102, customer: 'Test User', service: 'Wash', pickup: '2025-09-12 09:30', status: 'Pending' }
    ];
    component.confirmAction = 'reject';
    component.selectedOrderId = 102;
    
    spyOn(component, 'showToastMessage');
    
    component.confirmDecision();
    
    const updatedOrder = component.orders.find(o => o.id === 102);
    expect(updatedOrder?.status).toBe('Rejected');
    expect(component.showToastMessage).toHaveBeenCalledWith('Order rejected successfully');
    expect(component.showConfirmModal).toBeFalsy();
  });

  it('should update order status', () => {
    component.orders = [
      { id: 101, customer: 'Test User', service: 'Wash', pickup: '2025-09-12 09:30', status: 'Accepted' }
    ];
    
    spyOn(component, 'showToastMessage');
    
    const mockEvent = {
      target: { value: 'In Progress' }
    } as any;
    
    component.updateOrderStatus(101, mockEvent);
    
    const updatedOrder = component.orders.find(o => o.id === 101);
    expect(updatedOrder?.status).toBe('In Progress');
    expect(component.showToastMessage).toHaveBeenCalledWith('Order status updated to In Progress');
  });

  it('should show toast message', fakeAsync(() => {
    component.showToastMessage('Test message');
    
    expect(component.showToast).toBeTruthy();
    expect(component.toastMessage).toBe('Test message');
    
    tick(3000);
    
    expect(component.showToast).toBeFalsy();
  }));

  it('should format date time correctly', () => {
    const testDate = '2025-09-12T09:30:00';
    const formatted = component.formatDateTime(testDate);
    
    expect(formatted).toContain('9/12/2025');
    expect(formatted).toContain('09:30');
  });

  it('should identify pending orders correctly', () => {
    expect(component.isPending('Pending')).toBeTruthy();
    expect(component.isPending('Accepted')).toBeFalsy();
    expect(component.isPending('Rejected')).toBeFalsy();
  });

  it('should identify accepted orders correctly', () => {
    expect(component.isAccepted('Accepted')).toBeTruthy();
    expect(component.isAccepted('Pending')).toBeFalsy();
    expect(component.isAccepted('Completed')).toBeFalsy();
  });

  it('should identify orders that can change status', () => {
    expect(component.canChangeStatus('Accepted')).toBeTruthy();
    expect(component.canChangeStatus('Picked')).toBeTruthy();
    expect(component.canChangeStatus('In Progress')).toBeTruthy();
    expect(component.canChangeStatus('Delivered')).toBeTruthy();
    expect(component.canChangeStatus('Pending')).toBeFalsy();
    expect(component.canChangeStatus('Rejected')).toBeFalsy();
    expect(component.canChangeStatus('Completed')).toBeFalsy();
  });

  it('should render orders in desktop table view', () => {
    const tableRows = compiled.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(component.orders.length);
  });

  it('should render orders in mobile card view', () => {
    const cards = compiled.querySelectorAll('.lg\\:hidden .bg-white');
    expect(cards.length).toBe(component.orders.length);
  });

  it('should display accept and reject buttons for pending orders', () => {
    fixture.detectChanges();
    
    const pendingOrderRow = compiled.querySelector('tbody tr');
    const acceptButton = pendingOrderRow?.querySelector('.bg-green-600');
    const rejectButton = pendingOrderRow?.querySelector('.bg-red-600');
    
    expect(acceptButton).toBeTruthy();
    expect(rejectButton).toBeTruthy();
    expect(acceptButton?.textContent).toContain('Accept');
    expect(rejectButton?.textContent).toContain('Reject');
  });

  it('should display status dropdown for accepted orders', () => {
    // Find an accepted order in the test data
    const acceptedOrder = component.orders.find(o => o.status === 'Accepted');
    if (acceptedOrder) {
      fixture.detectChanges();
      const statusSelect = compiled.querySelector('select');
      expect(statusSelect).toBeTruthy();
    }
  });

  it('should handle click events on accept button', () => {
    spyOn(component, 'showConfirmation');
    
    const acceptButton = compiled.querySelector('.bg-green-600') as HTMLButtonElement;
    acceptButton?.click();
    
    expect(component.showConfirmation).toHaveBeenCalled();
  });

  it('should handle click events on reject button', () => {
    spyOn(component, 'showConfirmation');
    
    const rejectButton = compiled.querySelector('.bg-red-600') as HTMLButtonElement;
    rejectButton?.click();
    
    expect(component.showConfirmation).toHaveBeenCalled();
  });

  it('should handle notification bell click', () => {
    spyOn(component, 'toggleNotifications');
    
    const notificationButton = compiled.querySelector('button svg')?.parentElement as HTMLButtonElement;
    notificationButton?.click();
    
    expect(component.toggleNotifications).toHaveBeenCalled();
  });

  it('should track orders by ID for ngFor performance', () => {
    const mockOrder = { id: 123, customer: 'Test', service: 'Wash', pickup: '2025-09-12 09:30', status: 'Pending' as const };
    const result = component.trackByOrderId(0, mockOrder);
    expect(result).toBe(123);
  });

  // Integration test for new order simulation
  it('should simulate new order arrival', fakeAsync(() => {
    const initialOrderCount = component.orders.length;
    
    component.simulateNewOrders();
    tick(10000); // Wait for the timeout
    
    expect(component.orders.length).toBe(initialOrderCount + 1);
    expect(component.newOrdersCount).toBeGreaterThan(0);
  }));

  // Accessibility tests
  it('should have proper text content for buttons', () => {
    fixture.detectChanges();
    
    const acceptButton = compiled.querySelector('.bg-green-600') as HTMLButtonElement;
    const rejectButton = compiled.querySelector('.bg-red-600') as HTMLButtonElement;
    
    expect(acceptButton?.textContent).toContain('Accept');
    expect(rejectButton?.textContent).toContain('Reject');
  });
});