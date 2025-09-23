import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent, CartItem } from '../../../../shared/components/dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;

  constructor(@Inject(DashboardLayoutComponent) private dashboardLayout: DashboardLayoutComponent) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    // Get cart items from the dashboard layout component
    this.cartItems = this.dashboardLayout.cartItems;
    this.cartTotal = this.dashboardLayout.getCartTotal();
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item);
    } else {
      this.dashboardLayout.updateCartItemQuantity(item.id, newQuantity);
      this.loadCart(); // Refresh cart data
    }
  }

  removeItem(item: CartItem): void {
    this.dashboardLayout.removeFromCart(item.id);
    this.loadCart(); // Refresh cart data
  }

  clearCart(): void {
    this.dashboardLayout.clearCart();
    this.loadCart(); // Refresh cart data
  }

  proceedToCheckout(): void {
    // Navigate to payment checkout
    this.dashboardLayout.navigateToPage('payment-checkout');
  }

  continueShopping(): void {
    // Navigate to book service
    this.dashboardLayout.navigateToPage('book-service');
  }
}
