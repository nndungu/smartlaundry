import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  selectedMethod: string | null = null;
  isProcessing = false;
  paymentSuccess = false;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+254\d{9}$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {}

  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;
    this.paymentSuccess = false;
    
    // Reset all form controls
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.setValue('');
      this.paymentForm.get(key)?.markAsUntouched();
    });
  }

  getPaymentMethodClass(method: string): string {
    const baseClasses = 'flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md border transition-colors duration-200';
    
    if (this.selectedMethod === method) {
      return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700`;
    } else {
      return `${baseClasses} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
    }
  }

  get phoneNumber() {
    return this.paymentForm.get('phoneNumber');
  }

  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get expiryDate() {
    return this.paymentForm.get('expiryDate');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  onSubmit(): void {
    if (!this.isCurrentMethodValid() || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Simulate API call
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;
      
      // Reset form after successful submission
      this.paymentForm.reset();
      this.selectedMethod = null;
    }, 2000);
  }

  // Helper method to check if current payment method form is valid
  isCurrentMethodValid(): boolean {
    if (!this.selectedMethod) return false;

    if (this.selectedMethod === 'mpesa') {
      return this.phoneNumber?.valid || false;
    } else if (this.selectedMethod === 'card') {
      return this.cardNumber?.valid && this.expiryDate?.valid && this.cvv?.valid || false;
    }

    return false;
  }
}