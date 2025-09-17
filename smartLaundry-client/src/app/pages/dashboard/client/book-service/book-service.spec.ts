import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BookServiceComponent, LaundryPackage, BookingFormData } from './book-service';

describe('BookServiceComponent', () => {
  let component: BookServiceComponent;
  let fixture: ComponentFixture<BookServiceComponent>;
  let debugElement: DebugElement;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookServiceComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookServiceComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 4 laundry packages', () => {
    expect(component.laundryPackages).toBeDefined();
    expect(component.laundryPackages.length).toBe(4);
  });

  it('should have correct package structure', () => {
    const firstPackage = component.laundryPackages[0];
    expect(firstPackage).toHaveProperty('id');
    expect(firstPackage).toHaveProperty('name');
    expect(firstPackage).toHaveProperty('price');
    expect(firstPackage).toHaveProperty('features');
    expect(firstPackage).toHaveProperty('bagCount');
  });

  it('should initialize reactive form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.bookingForm).toBeDefined();
    expect(component.bookingForm.get('customerName')).toBeTruthy();
    expect(component.bookingForm.get('email')).toBeTruthy();
    expect(component.bookingForm.get('phone')).toBeTruthy();
    expect(component.bookingForm.get('address')).toBeTruthy();
  });

  it('should render page title and subtitle', () => {
    const titleElement = debugElement.query(By.css('.page-title'));
    const subtitleElement = debugElement.query(By.css('.page-subtitle'));
    
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Book Your Laundry Service');
    expect(subtitleElement).toBeTruthy();
  });

  it('should render all laundry packages', () => {
    const packageCards = debugElement.queryAll(By.css('.package-card'));
    expect(packageCards.length).toBe(component.laundryPackages.length);
  });

  it('should mark popular package correctly', () => {
    const popularPackages = component.laundryPackages.filter(pkg => pkg.popular);
    const popularCards = debugElement.queryAll(By.css('.package-card.popular'));
    
    expect(popularCards.length).toBe(popularPackages.length);
    
    if (popularCards.length > 0) {
      const popularBadge = popularCards[0].query(By.css('.popular-badge'));
      expect(popularBadge).toBeTruthy();
      expect(popularBadge.nativeElement.textContent.trim()).toBe('Most Popular');
    }
  });

  it('should display package details correctly', () => {
    const packageCards = debugElement.queryAll(By.css('.package-card'));
    
    packageCards.forEach((card, index) => {
      const package = component.laundryPackages[index];
      
      const nameElement = card.query(By.css('.package-name'));
      const priceElement = card.query(By.css('.current-price'));
      const bagCountElement = card.query(By.css('.bag-count'));
      
      expect(nameElement.nativeElement.textContent.trim()).toBe(package.name);
      expect(priceElement.nativeElement.textContent).toContain(package.price.toString());
      expect(bagCountElement.nativeElement.textContent.trim()).toBe(package.bagCount.toString());
    });
  });

  it('should select package when clicked', () => {
    const firstPackageCard = debugElement.query(By.css('.package-card'));
    const expectedPackage = component.laundryPackages[0];
    
    firstPackageCard.nativeElement.click();
    fixture.detectChanges();
    
    expect(component.selectedPackage).toEqual(expectedPackage);
    expect(component.showBookingForm).toBe(true);
    expect(component.bookingForm.get('packageId')?.value).toBe(expectedPackage.id);
  });

  it('should show booking form when package is selected', () => {
    // Initially form should be hidden
    let bookingFormSection = debugElement.query(By.css('.booking-form-section'));
    expect(bookingFormSection).toBeFalsy();
    
    // Select a package
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    bookingFormSection = debugElement.query(By.css('.booking-form-section'));
    expect(bookingFormSection).toBeTruthy();
  });

  it('should validate required form fields', () => {
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    // Try to submit empty form
    component.onSubmit();
    
    expect(component.bookingForm.valid).toBe(false);
    expect(component.bookingForm.get('customerName')?.errors?.['required']).toBe(true);
    expect(component.bookingForm.get('email')?.errors?.['required']).toBe(true);
    expect(component.bookingForm.get('phone')?.errors?.['required']).toBe(true);
    expect(component.bookingForm.get('address')?.errors?.['required']).toBe(true);
  });

  it('should validate email format', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const emailControl = component.bookingForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    
    expect(emailControl?.errors?.['email']).toBe(true);
    expect(component.isFieldInvalid('email')).toBe(true);
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should validate phone number pattern', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const phoneControl = component.bookingForm.get('phone');
    phoneControl?.setValue('123');
    phoneControl?.markAsTouched();
    
    expect(phoneControl?.errors?.['pattern']).toBe(true);
    expect(component.isFieldInvalid('phone')).toBe(true);
    
    phoneControl?.setValue('+254700123456');
    expect(phoneControl?.errors).toBeNull();
  });

  it('should handle addon selection', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const mockEvent = {
      target: { checked: true }
    } as unknown as Event;
    
    component.onAddonChange('express', mockEvent);
    
    const addons = component.bookingForm.get('addons')?.value;
    expect(addons).toContain('express');
  });

  it('should handle addon deselection', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    // First select addon
    let mockEvent = {
      target: { checked: true }
    } as unknown as Event;
    
    component.onAddonChange('express', mockEvent);
    
    // Then deselect it
    mockEvent = {
      target: { checked: false }
    } as unknown as Event;
    
    component.onAddonChange('express', mockEvent);
    
    const addons = component.bookingForm.get('addons')?.value;
    expect(addons).not.toContain('express');
  });

  it('should calculate total price correctly', () => {
    component.selectPackage(component.laundryPackages[0]);
    const basePrice = component.selectedPackage!.price;
    
    // Without addons
    expect(component.calculateTotal()).toBe(basePrice);
    
    // With addons
    const mockEvent = {
      target: { checked: true }
    } as unknown as Event;
    
    component.onAddonChange('express', mockEvent);
    
    const expressAddon = component.addons.find(a => a.id === 'express');
    const expectedTotal = basePrice + (expressAddon?.price || 0);
    
    expect(component.calculateTotal()).toBe(expectedTotal);
  });

  it('should return minimum date as tomorrow', () => {
    const minDate = component.getMinDate();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDate = tomorrow.toISOString().split('T')[0];
    
    expect(minDate).toBe(expectedDate);
  });

  it('should reset form and selections', () => {
    // Select package and fill form
    component.selectPackage(component.laundryPackages[0]);
    component.bookingForm.patchValue({
      customerName: 'John Doe',
      email: 'john@example.com'
    });
    
    // Reset
    component.resetForm();
    
    expect(component.selectedPackage).toBeNull();
    expect(component.showBookingForm).toBe(false);
    expect(component.bookingForm.get('customerName')?.value).toBeNull();
  });

  it('should process booking with valid form data', () => {
    spyOn(component, 'processBooking' as any);
    spyOn(window, 'alert');
    
    // Select package and fill valid form data
    component.selectPackage(component.laundryPackages[0]);
    component.bookingForm.patchValue({
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+254700123456',
      address: '123 Test Street, Nairobi',
      pickupDate: '2024-12-25',
      pickupTime: '10:00 AM - 12:00 PM'
    });
    
    component.onSubmit();
    
    expect(component['processBooking']).toHaveBeenCalled();
  });

  it('should provide correct error messages', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const customerNameControl = component.bookingForm.get('customerName');
    customerNameControl?.setValue('');
    customerNameControl?.markAsTouched();
    
    expect(component.getFieldError('customerName')).toBe('customerName is required');
    
    const emailControl = component.bookingForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    
    expect(component.getFieldError('email')).toBe('Please enter a valid email');
  });

  it('should render time slots correctly', () => {
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    const timeSelect = debugElement.query(By.css('#pickupTime'));
    const options = timeSelect.queryAll(By.css('option'));
    
    // +1 for the default "Select time slot" option
    expect(options.length).toBe(component.timeSlots.length + 1);
  });

  it('should render addons correctly', () => {
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    const addonItems = debugElement.queryAll(By.css('.addon-item'));
    expect(addonItems.length).toBe(component.addons.length);
    
    addonItems.forEach((item, index) => {
      const addon = component.addons[index];
      const addonName = item.query(By.css('.addon-name'));
      const addonPrice = item.query(By.css('.addon-price'));
      
      expect(addonName.nativeElement.textContent.trim()).toBe(addon.name);
      expect(addonPrice.nativeElement.textContent).toContain(addon.price.toString());
    });
  });

  it('should render benefits section correctly', () => {
    const benefitsSection = debugElement.query(By.css('.why-choose-us'));
    expect(benefitsSection).toBeTruthy();
    
    const benefitItems = debugElement.queryAll(By.css('.benefit-item'));
    expect(benefitItems.length).toBe(4); // Should have 4 benefits
    
    const expectedBenefits = [
      'Free Pickup & Delivery',
      'Same Day Service', 
      'Eco-Friendly',
      'Quality Guarantee'
    ];
    
    benefitItems.forEach((item, index) => {
      const titleElement = item.query(By.css('h3'));
      expect(titleElement.nativeElement.textContent.trim()).toBe(expectedBenefits[index]);
    });
  });

  it('should display selected package summary when booking form is shown', () => {
    component.selectPackage(component.laundryPackages[1]); // Select couple package
    fixture.detectChanges();
    
    const packageSummary = debugElement.query(By.css('.selected-package-summary'));
    expect(packageSummary).toBeTruthy();
    
    const summaryTitle = packageSummary.query(By.css('h3'));
    expect(summaryTitle.nativeElement.textContent).toContain('Couple Package');
    
    const packagePrice = packageSummary.query(By.css('.package-price'));
    expect(packagePrice.nativeElement.textContent).toContain('1500');
  });

  it('should track packages by ID', () => {
    const testPackage = component.laundryPackages[0];
    const result = component.trackByPackageId(0, testPackage);
    expect(result).toBe(testPackage.id);
  });

  it('should validate minimum length for customer name', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const nameControl = component.bookingForm.get('customerName');
    nameControl?.setValue('A'); // Too short
    nameControl?.markAsTouched();
    
    expect(nameControl?.errors?.['minlength']).toBeTruthy();
    expect(component.isFieldInvalid('customerName')).toBe(true);
  });

  it('should validate minimum length for address', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    const addressControl = component.bookingForm.get('address');
    addressControl?.setValue('123'); // Too short
    addressControl?.markAsTouched();
    
    expect(addressControl?.errors?.['minlength']).toBeTruthy();
    expect(component.isFieldInvalid('address')).toBe(true);
  });

  it('should show order summary with selected addons', () => {
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    // Add some addons
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.onAddonChange('express', mockEvent);
    component.onAddonChange('ironing', mockEvent);
    
    fixture.detectChanges();
    
    const orderSummary = debugElement.query(By.css('.order-summary'));
    expect(orderSummary).toBeTruthy();
    
    const totalElement = orderSummary.query(By.css('.summary-total'));
    expect(totalElement).toBeTruthy();
    
    // Should show base price + addon prices
    const expectedTotal = component.calculateTotal();
    expect(totalElement.nativeElement.textContent).toContain(expectedTotal.toString());
  });

  it('should disable submit button when form is invalid', () => {
    component.selectPackage(component.laundryPackages[0]);
    fixture.detectChanges();
    
    const submitButton = debugElement.query(By.css('.btn-primary'));
    expect(submitButton.nativeElement.disabled).toBe(true);
    
    // Fill valid form data
    component.bookingForm.patchValue({
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+254700123456',
      address: '123 Test Street, Nairobi, Kenya',
      pickupDate: '2024-12-25',
      pickupTime: '10:00 AM - 12:00 PM'
    });
    
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBe(false);
  });

  it('should show correct pricing with original price strikethrough', () => {
    const packageWithDiscount = component.laundryPackages.find(pkg => pkg.originalPrice);
    
    if (packageWithDiscount) {
      const packageCards = debugElement.queryAll(By.css('.package-card'));
      const targetCard = packageCards.find(card => {
        const nameElement = card.query(By.css('.package-name'));
        return nameElement.nativeElement.textContent.trim() === packageWithDiscount.name;
      });
      
      expect(targetCard).toBeTruthy();
      
      const originalPriceElement = targetCard!.query(By.css('.original-price'));
      const currentPriceElement = targetCard!.query(By.css('.current-price'));
      const savingsElement = targetCard!.query(By.css('.savings'));
      
      expect(originalPriceElement).toBeTruthy();
      expect(currentPriceElement).toBeTruthy();
      expect(savingsElement).toBeTruthy();
      
      expect(originalPriceElement.nativeElement.textContent).toContain(packageWithDiscount.originalPrice?.toString());
      expect(currentPriceElement.nativeElement.textContent).toContain(packageWithDiscount.price.toString());
    }
  });

  it('should handle form submission with special instructions', () => {
    spyOn(console, 'log');
    
    component.selectPackage(component.laundryPackages[0]);
    
    // Fill form with special instructions
    component.bookingForm.patchValue({
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+254700123456',
      address: '123 Test Street, Nairobi, Kenya',
      pickupDate: '2024-12-25',
      pickupTime: '10:00 AM - 12:00 PM',
      specialInstructions: 'Please handle delicate items with care'
    });
    
    component.onSubmit();
    
    expect(console.log).toHaveBeenCalledWith('Booking submitted:', jasmine.any(Object));
  });

  it('should mark all form fields as touched when submit is clicked with invalid form', () => {
    component.selectPackage(component.laundryPackages[0]);
    
    // Try to submit empty form
    component.onSubmit();
    
    Object.keys(component.bookingForm.controls).forEach(key => {
      const control = component.bookingForm.get(key);
      expect(control?.touched).toBe(true);
    });
  });

  describe('Form Field Validation Helpers', () => {
    beforeEach(() => {
      component.selectPackage(component.laundryPackages[0]);
    });

    it('should correctly identify invalid fields', () => {
      const nameControl = component.bookingForm.get('customerName');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      
      expect(component.isFieldInvalid('customerName')).toBe(true);
      
      nameControl?.setValue('John Doe');
      expect(component.isFieldInvalid('customerName')).toBe(false);
    });

    it('should return appropriate error messages for different validation errors', () => {
      // Test required error
      const nameControl = component.bookingForm.get('customerName');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      expect(component.getFieldError('customerName')).toBe('customerName is required');
      
      // Test minlength error
      nameControl?.setValue('A');
      expect(component.getFieldError('customerName')).toBe('customerName is too short');
      
      // Test email error
      const emailControl = component.bookingForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      expect(component.getFieldError('email')).toBe('Please enter a valid email');
      
      // Test pattern error
      const phoneControl = component.bookingForm.get('phone');
      phoneControl?.setValue('123');
      phoneControl?.markAsTouched();
      expect(component.getFieldError('phone')).toBe('Please enter a valid phone number');
    });
  });

  describe('Package Selection UI', () => {
    it('should add selected class to chosen package card', () => {
      const firstPackageCard = debugElement.query(By.css('.package-card'));
      
      // Initially no package should be selected
      expect(firstPackageCard.nativeElement.classList.contains('selected')).toBe(false);
      
      // Select the package
      component.selectPackage(component.laundryPackages[0]);
      fixture.detectChanges();
      
      expect(firstPackageCard.nativeElement.classList.contains('selected')).toBe(true);
    });

    it('should update button text when package is selected', () => {
      const firstPackageCard = debugElement.query(By.css('.package-card'));
      const selectButton = firstPackageCard.query(By.css('.select-package-btn'));
      
      // Initially should show "Select Package"
      expect(selectButton.nativeElement.textContent.trim()).toBe('Select Package');
      
      // After selection should show "Selected"
      component.selectPackage(component.laundryPackages[0]);
      fixture.detectChanges();
      
      expect(selectButton.nativeElement.textContent.trim()).toBe('Selected');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels on package selection buttons', () => {
      const packageCards = debugElement.queryAll(By.css('.package-card'));
      
      packageCards.forEach((card, index) => {
        const selectButton = card.query(By.css('.select-package-btn'));
        const expectedAriaLabel = `Select ${component.laundryPackages[index].name}`;
        expect(selectButton.nativeElement.getAttribute('aria-label')).toBe(expectedAriaLabel);
      });
    });

    it('should have proper form labels associated with inputs', () => {
      component.selectPackage(component.laundryPackages[0]);
      fixture.detectChanges();
      
      const nameInput = debugElement.query(By.css('#customerName'));
      const nameLabel = debugElement.query(By.css('label[for="customerName"]'));
      
      expect(nameInput).toBeTruthy();
      expect(nameLabel).toBeTruthy();
      expect(nameLabel.nativeElement.getAttribute('for')).toBe('customerName');
    });
  });
});