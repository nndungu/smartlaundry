import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  selectedMethod: string | null = null;
  isProcessing = false;
  paymentSuccess = false;

  cartItems: CartItem[] = [];
  cartTotal = 0;
  orderReference = '';

  private cartSubscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+254\d{9}$/)]]
    });
  }

  ngOnInit(): void {
    this.cartSubscription.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
      })
    );
    this.cartSubscription.add(
      this.cartService.cartTotal$.subscribe(total => {
        this.cartTotal = total;
      })
    );

    if (this.cartService.getCartItems().length === 0) {
      this.router.navigate(['/client-dashboard/cart']);
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;
    this.paymentSuccess = false;
    this.paymentForm.reset();
  }

  getPaymentMethodClass(method: string): string {
    const base = 'flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md border transition-colors duration-200';
    return this.selectedMethod === method
      ? `${base} border-blue-500 bg-blue-50 text-blue-700`
      : `${base} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
  }

  get phoneNumber() { return this.paymentForm.get('phoneNumber'); }

  isCurrentMethodValid(): boolean {
    if (!this.selectedMethod) return false;
    if (this.selectedMethod === 'mpesa') return this.phoneNumber?.valid || false;
    if (this.selectedMethod === 'cash') return true;
    return false;
  }

  onSubmit(): void {
    if (!this.isCurrentMethodValid() || this.isProcessing) return;

    this.isProcessing = true;

    this.orderService.createOrder({
      items: this.cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        serviceType: item.service
      })),
      paymentMethod: this.selectedMethod!,
      serviceTypes: [...new Set(this.cartItems.map(i => i.service))]
    }).subscribe(order => {
      this.isProcessing = false;
      this.paymentSuccess = true;
      this.orderReference = order.referenceNumber;

      this.cartService.clearCart();

      setTimeout(() => {
        this.router.navigate(['/client-dashboard/order-tracking']);
      }, 2000);
    });
  }
}