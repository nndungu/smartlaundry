import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart changes for reactive updates
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
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.id, newQuantity);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    // Navigate to payment checkout
    this.router.navigate(['/client-dashboard/payment-checkout']);
  }

  continueShopping(): void {
    // Navigate to book service
    this.router.navigate(['/client-dashboard/book-service']);
  }
}
