import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingServiceComponent } from './booking-service.component';

describe('BookingServiceComponent', () => {
  let component: BookingServiceComponent;
  let fixture: ComponentFixture<BookingServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingServiceComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.currentPage).toBe(1);
      expect(component.itemsPerPage).toBe(16);
      expect(component.totalItems).toBe(39);
      expect(component.showBookingForm).toBeFalsy();
      expect(component.selectedPackage).toBeNull();
      expect(component.cartItems).toEqual([]);
    });

    it('should initialize form with proper structure', () => {
      expect(component.bookingForm).toBeDefined();
      expect(component.bookingForm.get('customerName')).toBeDefined();
      expect(component.bookingForm.get('phone')).toBeDefined();
      expect(component.bookingForm.get('email')).toBeDefined();
      expect(component.bookingForm.get('address')).toBeDefined();
      expect(component.bookingForm.get('pickupDate')).toBeDefined();
      expect(component.bookingForm.get('pickupTime')).toBeDefined();
      expect(component.bookingForm.get('addons')).toBeDefined();
      expect(component.bookingForm.get('specialInstructions')).toBeDefined();
    });

    it('should initialize data arrays', () => {
      expect(component.laundryPackages.length).toBeGreaterThan(0);
      expect(component.laundryItems.length).toBeGreaterThan(0);
      expect(component.addons.length).toBeGreaterThan(0);
      expect(component.timeSlots.length).toBeGreaterThan(0);
    });
  });

  describe('Package Selection', () => {
    it('should select a package', () => {
      const testPackage = component.laundryPackages[0];
      component.selectPackage(testPackage);

      expect(component.selectedPackage).toBe(testPackage);
      expect(component.showBookingForm).toBeTruthy();
    });

    it('should track packages by id', () => {
      const testPackage = component.laundryPackages[0];
      const result = component.trackByPackageId(0, testPackage);
      expect(result).toBe(testPackage.id);
    });
  });

  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      const expectedPages = Math.ceil(component.totalItems / component.itemsPerPage);
      expect(component.totalPages).toBe(expectedPages);
    });

    it('should get current page items', () => {
      component.currentPage = 1;
      const items = component.getCurrentPageItems();
      expect(items.length).toBeLessThanOrEqual(component.itemsPerPage);
    });

    it('should calculate start index correctly', () => {
      component.currentPage = 1;
      expect(component.getStartIndex()).toBe(1);
      
      component.currentPage = 2;
      expect(component.getStartIndex()).toBe(17);
    });

    it('should calculate end index correctly', () => {
      component.currentPage = 1;
      const endIndex = component.getEndIndex();
      expect(endIndex).toBe(Math.min(16, component.totalItems));
    });

    it('should navigate to valid pages', () => {
      component.goToPage(2);
      expect(component.currentPage).toBe(2);

      // Should not navigate to invalid pages
      component.goToPage(0);
      expect(component.currentPage).toBe(2);

      component.goToPage(component.totalPages + 1);
      expect(component.currentPage).toBe(2);
    });

    it('should show start ellipsis when needed', () => {
      component.currentPage = 5;
      expect(component.showStartEllipsis()).toBeTruthy();

      component.currentPage = 2;
      expect(component.showStartEllipsis()).toBeFalsy();
    });

    it('should show end ellipsis when needed', () => {
      component.currentPage = 1;
      expect(component.showEndEllipsis()).toBeTruthy();

      component.currentPage = component.totalPages - 1;
      expect(component.showEndEllipsis()).toBeFalsy();
    });
  });

  describe('Cart Management', () => {
    let testItem: any;

    beforeEach(() => {
      testItem = {
        id: 'test-1',
        name: 'Test Item',
        price: 100,
        onSale: false
      };
    });

    it('should add item to basket', () => {
      component.addToBasket(testItem);
      expect(component.cartItems.length).toBe(1);
      expect(component.cartItems[0].quantity).toBe(1);
    });

    it('should increase quantity for existing item', () => {
      component.addToBasket(testItem);
      component.addToBasket(testItem);
      expect(component.cartItems.length).toBe(1);
      expect(component.cartItems[0].quantity).toBe(2);
    });

    it('should remove item from cart', () => {
      component.addToBasket(testItem);
      component.removeFromCart(0);
      expect(component.cartItems.length).toBe(0);
    });

    it('should increase quantity', () => {
      component.addToBasket(testItem);
      component.increaseQuantity(0);
      expect(component.cartItems[0].quantity).toBe(2);
    });

    it('should decrease quantity', () => {
      component.addToBasket(testItem);
      component.addToBasket(testItem); // quantity = 2
      component.decreaseQuantity(0);
      expect(component.cartItems[0].quantity).toBe(1);
    });

    it('should remove item when decreasing quantity to 0', () => {
      component.addToBasket(testItem);
      component.decreaseQuantity(0);
      expect(component.cartItems.length).toBe(0);
    });

    it('should calculate cart total', () => {
      component.addToBasket(testItem);
      component.addToBasket({ ...testItem, id: 'test-2', price: 200 });
      const total = component.getCartTotal();
      expect(total).toBe(300);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      expect(component.isFieldInvalid('customerName')).toBeFalsy();
      
      component.bookingForm.get('customerName')?.markAsTouched();
      expect(component.isFieldInvalid('customerName')).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.bookingForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      
      expect(component.isFieldInvalid('email')).toBeTruthy();
      expect(component.getFieldError('email')).toContain('valid email');
    });

    it('should validate phone number format', () => {
      const phoneControl = component.bookingForm.get('phone');
      phoneControl?.setValue('invalid-phone');
      phoneControl?.markAsTouched();
      
      expect(component.isFieldInvalid('phone')).toBeTruthy();
      expect(component.getFieldError('phone')).toContain('valid phone number');

      phoneControl?.setValue('+254712345678');
      expect(component.isFieldInvalid('phone')).toBeFalsy();
    });

    it('should get minimum date for pickup', () => {
      const minDate = component.getMinDate();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expectedDate = tomorrow.toISOString().split('T')[0];
      
      expect(minDate).toBe(expectedDate);
    });
  });

  describe('Addon Management', () => {
    it('should add addon to form', () => {
      const mockEvent = { target: { checked: true } };
      component.onAddonChange('express', mockEvent);
      
      const addons = component.bookingForm.get('addons')?.value;
      expect(addons).toContain('express');
    });

    it('should remove addon from form', () => {
      // First add the addon
      const addEvent = { target: { checked: true } };
      component.onAddonChange('express', addEvent);
      
      // Then remove it
      const removeEvent = { target: { checked: false } };
      component.onAddonChange('express', removeEvent);
      
      const addons = component.bookingForm.get('addons')?.value;
      expect(addons).not.toContain('express');
    });
  });

  describe('Price Calculations', () => {
    beforeEach(() => {
      component.selectedPackage = component.laundryPackages[0];
    });

    it('should calculate total with package price', () => {
      const total = component.calculateTotal();
      expect(total).toBe(component.selectedPackage!.price);
    });

    it('should calculate total with addons', () => {
      component.bookingForm.patchValue({ addons: ['express'] });
      const total = component.calculateTotal();
      const expectedTotal = component.selectedPackage!.price + component.addons[0].price;
      expect(total).toBe(expectedTotal);
    });

    it('should calculate grand total with cart items', () => {
      const testItem = {
        id: 'test-1',
        name: 'Test Item',
        price: 100,
        onSale: false
      };
      component.addToBasket(testItem);
      
      const grandTotal = component.calculateGrandTotal();
      const expectedTotal = component.selectedPackage!.price + 100;
      expect(grandTotal).toBe(expectedTotal);
    });

    it('should return 0 for calculations without selected package', () => {
      component.selectedPackage = null;
      expect(component.calculateTotal()).toBe(0);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.selectedPackage = component.laundryPackages[0];
      component.bookingForm.patchValue({
        customerName: 'John Doe',
        phone: '+254712345678',
        email: 'john@example.com',
        address: '123 Test Street, Nairobi',
        pickupDate: '2024-12-25',
        pickupTime: '8:00 AM - 10:00 AM'
      });
    });

    it('should submit valid form', () => {
      spyOn(console, 'log');
      spyOn(window, 'alert');
      
      component.onSubmit();
      
      expect(console.log).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Booking submitted successfully!');
    });

    it('should not submit invalid form', () => {
      component.bookingForm.patchValue({ customerName: '' });
      spyOn(console, 'log');
      
      component.onSubmit();
      
      expect(console.log).not.toHaveBeenCalled();
      expect(component.bookingForm.get('customerName')?.touched).toBeTruthy();
    });

    it('should not submit without selected package', () => {
      component.selectedPackage = null;
      spyOn(console, 'log');
      
      component.onSubmit();
      
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset all form data and selections', () => {
      // Set up some data
      component.selectedPackage = component.laundryPackages[0];
      component.showBookingForm = true;
      component.cartItems = [
        { id: '1', name: 'Test', price: 100, onSale: false, quantity: 1 }
      ];
      component.currentPage = 2;
      component.bookingForm.patchValue({ customerName: 'Test User' });

      // Reset
      component.resetForm();

      // Verify reset
      expect(component.selectedPackage).toBeNull();
      expect(component.showBookingForm).toBeFalsy();
      expect(component.cartItems).toEqual([]);
      expect(component.currentPage).toBe(1);
      expect(component.bookingForm.get('customerName')?.value).toBeNull();
    });
  });

  describe('Template Integration', () => {
    it('should display packages', () => {
      const packageElements = fixture.debugElement.queryAll(By.css('.package-card'));
      expect(packageElements.length).toBe(component.laundryPackages.length);
    });

    it('should display laundry items', () => {
      const itemElements = fixture.debugElement.queryAll(By.css('.laundry-item-card'));
      expect(itemElements.length).toBe(component.getCurrentPageItems().length);
    });

    it('should show booking form when package is selected', () => {
      component.selectPackage(component.laundryPackages[0]);
      fixture.detectChanges();
      
      const bookingForm = fixture.debugElement.query(By.css('.booking-form-section'));
      expect(bookingForm).toBeTruthy();
    });

    it('should hide booking form initially', () => {
      const bookingForm = fixture.debugElement.query(By.css('.booking-form-section'));
      expect(bookingForm).toBeFalsy();
    });

    it('should display cart items when present', () => {
      component.selectedPackage = component.laundryPackages[0];
      component.showBookingForm = true;
      component.addToBasket({
        id: 'test-1',
        name: 'Test Item',
        price: 100,
        onSale: false
      });
      fixture.detectChanges();
      
      const cartSummary = fixture.debugElement.query(By.css('.cart-summary'));
      expect(cartSummary).toBeTruthy();
    });

    it('should show pagination controls', () => {
      const pagination = fixture.debugElement.query(By.css('.pagination-container'));
      expect(pagination).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    it('should handle package selection click', () => {
      spyOn(component, 'selectPackage');
      
      const packageCard = fixture.debugElement.query(By.css('.package-card'));
      packageCard.triggerEventHandler('click', null);
      
      expect(component.selectPackage).toHaveBeenCalled();
    });

    it('should handle add to cart click', () => {
      spyOn(component, 'addToBasket');
      
      const addToCartBtn = fixture.debugElement.query(By.css('.add-to-cart-btn'));
      addToCartBtn.triggerEventHandler('click', null);
      
      expect(component.addToBasket).toHaveBeenCalled();
    });

    it('should handle pagination click', () => {
      spyOn(component, 'goToPage');
      
      const pageButton = fixture.debugElement.query(By.css('.page-number'));
      if (pageButton) {
        pageButton.triggerEventHandler('click', null);
        expect(component.goToPage).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      const selectPackageBtn = fixture.debugElement.query(By.css('.select-package-btn'));
      expect(selectPackageBtn.attributes['aria-label']).toBeDefined();
    });

    it('should have navigation aria label', () => {
      const pagination = fixture.debugElement.query(By.css('.pagination'));
      expect(pagination.attributes['aria-label']).toBe('Laundry basket pagination');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid pagination requests', () => {
      const initialPage = component.currentPage;
      
      component.goToPage(-1);
      expect(component.currentPage).toBe(initialPage);
      
      component.goToPage(component.totalPages + 10);
      expect(component.currentPage).toBe(initialPage);
    });

    it('should handle empty cart operations', () => {
      expect(() => component.removeFromCart(0)).not.toThrow();
      expect(() => component.increaseQuantity(0)).not.toThrow();
      expect(() => component.decreaseQuantity(0)).not.toThrow();
    });

    it('should handle invalid addon changes', () => {
      const invalidEvent = { target: { checked: true } };
      expect(() => component.onAddonChange('invalid-addon', invalidEvent)).not.toThrow();
    });
  });

  describe('Data Validation', () => {
    it('should have valid laundry package data structure', () => {
      component.laundryPackages.forEach(pkg => {
        expect(pkg.id).toBeDefined();
        expect(pkg.name).toBeDefined();
        expect(pkg.price).toBeGreaterThan(0);
        expect(pkg.currency).toBeDefined();
        expect(pkg.features).toBeDefined();
        expect(Array.isArray(pkg.features)).toBeTruthy();
      });
    });

    it('should have valid laundry item data structure', () => {
      component.laundryItems.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.price).toBeGreaterThan(0);
        expect(typeof item.onSale).toBe('boolean');
      });
    });

    it('should have valid addon data structure', () => {
      component.addons.forEach(addon => {
        expect(addon.id).toBeDefined();
        expect(addon.name).toBeDefined();
        expect(addon.price).toBeGreaterThan(0);
      });
    });
  });
});