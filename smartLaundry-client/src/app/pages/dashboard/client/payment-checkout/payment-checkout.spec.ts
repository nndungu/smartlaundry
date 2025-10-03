import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutPaymentComponent } from './checkout-payment.component';
import { By } from '@angular/platform-browser';

describe('CheckoutPaymentComponent', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutPaymentComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no payment method selected initially', () => {
    expect(component.selectedMethod).toBeNull();
  });

  it('should select M-Pesa payment method', () => {
    component.selectPaymentMethod('mpesa');
    expect(component.selectedMethod).toBe('mpesa');
  });

  it('should select Bank Card payment method', () => {
    component.selectPaymentMethod('card');
    expect(component.selectedMethod).toBe('card');
  });

  it('should validate M-Pesa phone number format', () => {
    component.selectPaymentMethod('mpesa');
    
    const phoneNumber = component.paymentForm.get('phoneNumber');
    phoneNumber?.setValue('+254712345678');
    expect(phoneNumber?.valid).toBeTruthy();

    phoneNumber?.setValue('+25471234567'); // Too short
    expect(phoneNumber?.valid).toBeFalsy();

    phoneNumber?.setValue('+255712345678'); // Wrong prefix
    expect(phoneNumber?.valid).toBeFalsy();
  });

  it('should validate card number format', () => {
    component.selectPaymentMethod('card');
    
    const cardNumber = component.paymentForm.get('cardNumber');
    cardNumber?.setValue('4111111111111111');
    expect(cardNumber?.valid).toBeTruthy();

    cardNumber?.setValue('4111'); // Too short
    expect(cardNumber?.valid).toBeFalsy();

    cardNumber?.setValue('4111-1111-1111-1111'); // With dashes
    expect(cardNumber?.valid).toBeFalsy();
  });

  it('should validate expiry date format', () => {
    component.selectPaymentMethod('card');
    
    const expiryDate = component.paymentForm.get('expiryDate');
    expiryDate?.setValue('12/25');
    expect(expiryDate?.valid).toBeTruthy();

    expiryDate?.setValue('13/25'); // Invalid month
    expect(expiryDate?.valid).toBeFalsy();

    expiryDate?.setValue('12-25'); // Wrong format
    expect(expiryDate?.valid).toBeFalsy();
  });

  it('should validate CVV format', () => {
    component.selectPaymentMethod('card');
    
    const cvv = component.paymentForm.get('cvv');
    cvv?.setValue('123');
    expect(cvv?.valid).toBeTruthy();

    cvv?.setValue('1234'); // 4 digits (AMEX)
    expect(cvv?.valid).toBeTruthy();

    cvv?.setValue('12'); // Too short
    expect(cvv?.valid).toBeFalsy();
  });

  it('should disable proceed button when form is invalid', () => {
    component.selectPaymentMethod('mpesa');
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable proceed button when form is valid', () => {
    component.selectPaymentMethod('mpesa');
    component.phoneNumber?.setValue('+254712345678');
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should show processing state on submit', fakeAsync(() => {
    component.selectPaymentMethod('mpesa');
    component.phoneNumber?.setValue('+254712345678');
    fixture.detectChanges();
    
    component.onSubmit();
    expect(component.isProcessing).toBeTruthy();
    
    tick(2000);
    expect(component.isProcessing).toBeFalsy();
    expect(component.paymentSuccess).toBeTruthy();
  }));

  it('should show success message after payment processing', fakeAsync(() => {
    component.selectPaymentMethod('mpesa');
    component.phoneNumber?.setValue('+254712345678');
    
    component.onSubmit();
    tick(2000);
    fixture.detectChanges();
    
    const successMessage = fixture.debugElement.query(By.css('.bg-green-50'));
    expect(successMessage).toBeTruthy();
    expect(successMessage.nativeElement.textContent).toContain('Payment request sent');
  }));

  it('should reset form after successful payment', fakeAsync(() => {
    component.selectPaymentMethod('mpesa');
    component.phoneNumber?.setValue('+254712345678');
    
    component.onSubmit();
    tick(2000);
    
    expect(component.selectedMethod).toBeNull();
    expect(component.phoneNumber?.value).toBe('');
  }));
});