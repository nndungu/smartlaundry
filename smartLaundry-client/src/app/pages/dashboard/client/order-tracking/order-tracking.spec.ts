import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

import { OrderTrackingComponent, LaundryOrder, OrderStatus } from './order-tracking';

describe('OrderTrackingComponent', () => {
  let component: OrderTrackingComponent;
  let fixture: ComponentFixture<OrderTrackingComponent>;
  let debugElement: DebugElement;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTrackingComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderTrackingComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tracking form with proper validation', () => {
    expect(component.trackingForm).toBeDefined();
    
    const trackingIdControl = component.trackingForm.get('trackingId');
    expect(trackingIdControl).toBeTruthy();
    expect(trackingIdControl?.hasError('required')).toBe(true);
    
    // Test pattern validation
    trackingIdControl?.setValue('invalid-id');
    expect(trackingIdControl?.hasError('pattern')).toBe(true);
    
    trackingIdControl?.setValue('SL-2024-001');
    expect(trackingIdControl?.valid).toBe(true);
  });

  it('should render page title and subtitle correctly', () => {
    const titleElement = debugElement.query(By.css('.page-title'));
    const subtitleElement = debugElement.query(By.css('.page-subtitle'));
    
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Track Your Order');
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.textContent).toContain('Enter your tracking ID');
  });

  it('should show help section when no order is tracked', () => {
    const helpSection = debugElement.query(By.css('.help-section'));
    expect(helpSection).toBeTruthy();
    
    const helpItems = debugElement.queryAll(By.css('.help-item'));
    expect(helpItems.length).toBe(4); // Should have 4 help items
  });

  it('should validate tracking ID format', () => {
    const trackingIdInput = debugElement.query(By.css('#trackingId'));
    
    // Test invalid format
    component.trackingForm.get('trackingId')?.setValue('invalid-format');
    component.trackingForm.get('trackingId')?.markAsTouched();
    fixture.detectChanges();
    
    expect(component.isFieldInvalid('trackingId')).toBe(true);
    expect(component.getFieldError('trackingId')).toBe('Please enter a valid tracking ID (e.g., SL-2024-001)');
    
    // Test valid format
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    expect(component.isFieldInvalid('trackingId')).toBe(false);
  });

  it('should show loading state during order search', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    
    // Trigger form submission
    component.trackOrder();
    
    expect(component.isLoading).toBe(true);
    
    const trackButton = debugElement.query(By.css('.track-btn'));
    expect(trackButton.nativeElement.disabled).toBe(true);
    
    // Advance time to complete the simulated API call
    tick(1500);
    fixture.detectChanges();
    
    expect(component.isLoading).toBe(false);
    expect(trackButton.nativeElement.disabled).toBe(false);
  }));

  it('should display order details when valid tracking ID is found', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500); // Wait for simulated API call
    fixture.detectChanges();
    
    expect(component.currentOrder).toBeTruthy();
    expect(component.currentOrder?.id).toBe('SL-2024-001');
    
    // Check if order details section is displayed
    const orderDetailsSection = debugElement.query(By.css('.order-details-section'));
    expect(orderDetailsSection).toBeTruthy();
    
    // Check if order title is displayed correctly
    const orderTitle = debugElement.query(By.css('.order-title'));
    expect(orderTitle.nativeElement.textContent).toContain('SL-2024-001');
  }));

  it('should show error message for invalid tracking ID', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-9999-999');
    component.trackOrder();
    
    tick(1500); // Wait for simulated API call
    fixture.detectChanges();
    
    expect(component.errorMessage).toBe('Order not found. Please check your tracking ID and try again.');
    expect(component.currentOrder).toBeNull();
    
    const errorAlert = debugElement.query(By.css('.error-alert'));
    expect(errorAlert).toBeTruthy();
  }));

  it('should display progress bar with correct percentage', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const progressPercentage = component.getStatusProgress();
    expect(progressPercentage).toBeGreaterThan(0);
    
    const progressElement = debugElement.query(By.css('.progress-percentage'));
    expect(progressElement.nativeElement.textContent).toContain(`${progressPercentage}% Complete`);
    
    const progressFill = debugElement.query(By.css('.progress-fill'));
    expect(progressFill.nativeElement.style.width).toBe(`${progressPercentage}%`);
  }));

  it('should display status timeline with correct statuses', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const timelineItems = debugElement.queryAll(By.css('.timeline-item'));
    expect(timelineItems.length).toBe(component.currentOrder!.statusHistory.length);
    
    // Check completed status
    const completedItems = timelineItems.filter(item => 
      item.nativeElement.classList.contains('completed')
    );
    const expectedCompletedCount = component.currentOrder!.statusHistory.filter(s => s.completed).length;
    expect(completedItems.length).toBe(expectedCompletedCount);
    
    // Check active status
    const activeItems = timelineItems.filter(item => 
      item.nativeElement.classList.contains('active')
    );
    expect(activeItems.length).toBe(1);
  }));

  it('should display customer information correctly', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const customerInfoCard = debugElement.query(By.css('.customer-info'));
    expect(customerInfoCard).toBeTruthy();
    
    const infoValues = customerInfoCard.queryAll(By.css('.info-value'));
    expect(infoValues[0].nativeElement.textContent.trim()).toBe('John Doe');
    expect(infoValues[1].nativeElement.textContent.trim()).toBe('+254700123456');
    expect(infoValues[2].nativeElement.textContent.trim()).toBe('john.doe@email.com');
  }));

  it('should display laundry items correctly', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const itemCards = debugElement.queryAll(By.css('.item-card'));
    expect(itemCards.length).toBe(component.currentOrder!.items.length);
    
    // Check first item details
    const firstItemName = itemCards[0].query(By.css('.item-name'));
    expect(firstItemName.nativeElement.textContent.trim()).toBe('Cotton Shirts');
    
    const firstItemQuantity = itemCards[0].query(By.css('.item-quantity'));
    expect(firstItemQuantity.nativeElement.textContent.trim()).toBe('Qty: 5');
  }));

  it('should handle refresh order functionality', fakeAsync(() => {
    // First track an order
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    tick(1500);
    fixture.detectChanges();
    
    // Spy on the search method
    spyOn(component, 'refreshOrder').and.callThrough();
    
    const refreshButton = debugElement.query(By.css('.refresh-btn'));
    refreshButton.nativeElement.click();
    
    expect(component.refreshOrder).toHaveBeenCalled();
  }));

  it('should toggle auto-refresh functionality', () => {
    expect(component.autoRefreshEnabled).toBe(true);
    
    component.toggleAutoRefresh();
    expect(component.autoRefreshEnabled).toBe(false);
    
    component.toggleAutoRefresh();
    expect(component.autoRefreshEnabled).toBe(true);
  });

  it('should clear search and reset component state', fakeAsync(() => {
    // First track an order
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    tick(1500);
    
    expect(component.currentOrder).toBeTruthy();
    
    // Clear search
    component.clearSearch();
    
    expect(component.currentOrder).toBeNull();
    expect(component.errorMessage).toBe('');
    expect(component.trackingForm.get('trackingId')?.value).toBeNull();
  }));

  it('should format date correctly', () => {
    const testDate = '2024-01-15T10:30:00Z';
    const formattedDate = component.formatDate(testDate);
    
    expect(typeof formattedDate).toBe('string');
    expect(formattedDate.length).toBeGreaterThan(0);
  });

  it('should format time correctly', () => {
    const testDate = '2024-01-15T10:30:00Z';
    const formattedTime = component.formatTime(testDate);
    
    expect(typeof formattedTime).toBe('string');
    expect(formattedTime).toMatch(/\d{1,2}:\d{2}/); // Should match time format
  });

  it('should calculate status progress correctly', () => {
    // Mock an order with 3 completed out of 7 total statuses
    const mockOrder: LaundryOrder = {
      id: 'TEST-001',
      statusHistory: [
        { id: '1', title: 'Test 1', description: '', icon: '', completed: true, active: false },
        { id: '2', title: 'Test 2', description: '', icon: '', completed: true, active: false },
        { id: '3', title: 'Test 3', description: '', icon: '', completed: true, active: false },
        { id: '4', title: 'Test 4', description: '', icon: '', completed: false, active: true },
        { id: '5', title: 'Test 5', description: '', icon: '', completed: false, active: false }
      ]
    } as LaundryOrder;
    
    component.currentOrder = mockOrder;
    
    const progress = component.getStatusProgress();
    expect(progress).toBe(60); // 3/5 * 100 = 60%
  });

  it('should return 0 progress when no order is present', () => {
    component.currentOrder = null;
    const progress = component.getStatusProgress();
    expect(progress).toBe(0);
  });

  it('should handle call driver functionality', () => {
    spyOn(window, 'open');
    
    const mockOrder = {
      driverPhone: '+254701234567'
    } as LaundryOrder;
    
    component.currentOrder = mockOrder;
    component.callDriver();
    
    expect(window.open).toHaveBeenCalledWith('tel:+254701234567', '_self');
  });

  it('should handle contact support functionality', () => {
    spyOn(window, 'open');
    
    component.contactSupport();
    
    expect(window.open).toHaveBeenCalledWith('tel:+254116174326', '_self');
  });

  it('should show call driver button when driver phone is available', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const callDriverButton = debugElement.query(By.css('.primary-btn'));
    expect(callDriverButton).toBeTruthy();
    expect(callDriverButton.nativeElement.textContent).toContain('Call Driver');
  }));

  it('should disable form input during loading', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    
    component.trackOrder();
    fixture.detectChanges();
    
    const trackingIdInput = debugElement.query(By.css('#trackingId'));
    expect(trackingIdInput.nativeElement.disabled).toBe(true);
    
    tick(1500);
    fixture.detectChanges();
    
    expect(trackingIdInput.nativeElement.disabled).toBe(false);
  }));

  it('should show loading spinner during search', () => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    
    component.trackOrder();
    fixture.detectChanges();
    
    const loadingSpinner = debugElement.query(By.css('.loading-spinner'));
    expect(loadingSpinner).toBeTruthy();
    
    const spinnerIcon = debugElement.query(By.css('.spinner'));
    expect(spinnerIcon).toBeTruthy();
  });

  it('should handle form submission with invalid form', () => {
    // Don't set any value, form should be invalid
    component.trackOrder();
    
    const trackingIdControl = component.trackingForm.get('trackingId');
    expect(trackingIdControl?.touched).toBe(true);
    expect(component.currentOrder).toBeNull();
  });

  it('should display special instructions when available', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const specialInstructionsCard = debugElement.query(By.css('.special-instructions'));
    expect(specialInstructionsCard).toBeTruthy();
    
    const instructionsText = specialInstructionsCard.query(By.css('.instructions-text'));
    expect(instructionsText.nativeElement.textContent.trim()).toBe('Please handle delicate items with care');
  }));

  it('should display item notes when available', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const itemCards = debugElement.queryAll(By.css('.item-card'));
    // Second item should have notes
    const itemWithNotes = itemCards[1];
    const itemNotes = itemWithNotes.query(By.css('.item-notes'));
    
    expect(itemNotes).toBeTruthy();
    expect(itemNotes.nativeElement.textContent).toContain('Oil stain on front');
  }));

  it('should show stained condition styling for damaged items', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    const itemCards = debugElement.queryAll(By.css('.item-card'));
    const stainedItem = itemCards[1]; // Jeans with oil stain
    const conditionElement = stainedItem.query(By.css('.item-condition.stained'));
    
    expect(conditionElement).toBeTruthy();
    expect(conditionElement.nativeElement.textContent.trim()).toBe('Stained');
  }));

  it('should track items by ID correctly', () => {
    const testItem = { id: 'test-id', name: 'Test Item' } as any;
    const result = component.trackByItemId(0, testItem);
    expect(result).toBe('test-id');
  });

  it('should track status by ID correctly', () => {
    const testStatus: OrderStatus = {
      id: 'status-id',
      title: 'Test Status',
      description: '',
      icon: '',
      completed: false,
      active: false
    };
    const result = component.trackByStatusId(0, testStatus);
    expect(result).toBe('status-id');
  });

  it('should show different order status when tracking completed order', fakeAsync(() => {
    component.trackingForm.get('trackingId')?.setValue('SL-2024-002');
    component.trackOrder();
    
    tick(1500);
    fixture.detectChanges();
    
    expect(component.currentOrder?.currentStatus).toBe('delivered');
    
    const timelineItems = debugElement.queryAll(By.css('.timeline-item.completed'));
    expect(timelineItems.length).toBe(7); // All statuses should be completed
  }));

  describe('Form Validation Helper Methods', () => {
    it('should correctly identify invalid fields', () => {
      const trackingIdControl = component.trackingForm.get('trackingId');
      
      trackingIdControl?.setValue('');
      trackingIdControl?.markAsTouched();
      expect(component.isFieldInvalid('trackingId')).toBe(true);
      
      trackingIdControl?.setValue('SL-2024-001');
      expect(component.isFieldInvalid('trackingId')).toBe(false);
    });

    it('should return appropriate error messages', () => {
      const trackingIdControl = component.trackingForm.get('trackingId');
      
      // Test required error
      trackingIdControl?.setValue('');
      trackingIdControl?.markAsTouched();
      expect(component.getFieldError('trackingId')).toBe('Tracking ID is required');
      
      // Test pattern error
      trackingIdControl?.setValue('invalid-format');
      expect(component.getFieldError('trackingId')).toBe('Please enter a valid tracking ID (e.g., SL-2024-001)');
      
      // Test no error
      trackingIdControl?.setValue('SL-2024-001');
      expect(component.getFieldError('trackingId')).toBe('');
    });
  });

  describe('Component Lifecycle', () => {
    it('should start auto-refresh on init', () => {
      spyOn(component, 'startAutoRefresh' as any);
      component.ngOnInit();
      expect(component['startAutoRefresh']).toHaveBeenCalled();
    });

    it('should stop auto-refresh on destroy', () => {
      spyOn(component, 'stopAutoRefresh' as any);
      component.ngOnDestroy();
      expect(component['stopAutoRefresh']).toHaveBeenCalled();
    });

    it('should unsubscribe from auto-refresh when component is destroyed', () => {
      const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['autoRefreshSubscription'] = mockSubscription;
      
      component.ngOnDestroy();
      
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', fakeAsync(() => {
      component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
      component.trackOrder();
      
      tick(1500);
      fixture.detectChanges();
      
      const refreshButton = debugElement.query(By.css('.refresh-btn'));
      expect(refreshButton.nativeElement.getAttribute('aria-label')).toBe('Refresh order status');
    }));

    it('should have proper progress bar accessibility attributes', fakeAsync(() => {
      component.trackingForm.get('trackingId')?.setValue('SL-2024-001');
      component.trackOrder();
      
      tick(1500);
      fixture.detectChanges();
      
      const progressFill = debugElement.query(By.css('.progress-fill'));
      expect(progressFill.nativeElement.getAttribute('role')).toBe('progressbar');
      expect(progressFill.nativeElement.getAttribute('aria-valuemin')).toBe('0');
      expect(progressFill.nativeElement.getAttribute('aria-valuemax')).toBe('100');
    }));

    it('should have proper error alert role', () => {
      component.errorMessage = 'Test error';
      fixture.detectChanges();
      
      const errorAlert = debugElement.query(By.css('.error-alert'));
      expect(errorAlert.nativeElement.getAttribute('role')).toBe('alert');
    });
  });
});