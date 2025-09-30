import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { CartService, CartItem } from '../../../services/cart.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.scss']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  notificationCount = 0;
  cartItemCount = 0;
  userName = 'User';
  private userSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: '📊', active: false, route: '/client-dashboard' },
    { id: 'book-service', text: 'Book Service', icon: '🛒', active: false, route: '/client-dashboard/book-service' },
    { id: 'cart', text: 'Cart', icon: '🛒', active: false, route: '/client-dashboard/cart' },
    { id: 'order-tracking', text: 'Order Tracking', icon: '📱', active: false, route: '/client-dashboard/order-tracking' },
    { id: 'order-history', text: 'Order History', icon: '📜', active: false, route: '/client-dashboard/order-history' },
    { id: 'payments', text: 'Payments', icon: '💳', active: false, route: '/client-dashboard/payment-checkout' },
    { id: 'notifications', text: 'Notifications', icon: '🔔', active: false, route: '/client-dashboard/notifications' },
    { id: 'profile', text: 'Profile', icon: '👤', active: false, route: '/client-dashboard/profile-update' }
  ];

  constructor(@Inject(Router) private router: Router, private authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to user data
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user && user.firstName && user.lastName) {
        this.userName = `${user.firstName} ${user.lastName}`;
      } else {
        this.userName = 'User';
      }
    });

    // Subscribe to router events to update active navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveNavItem(event.urlAfterRedirects);
    });

    // Subscribe to cart changes for reactive cart count
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    // Set initial active item
    this.updateActiveNavItem(this.router.url);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  handleSearch(event: any): void {
    const searchTerm = event.target.value;
    // Implement search logic here
    console.log('Search term:', searchTerm);
  }

  openCart(): void {
    // Navigate to cart page
    this.navigateToPage('cart');
  }

  openNotifications(): void {
    // Implement notification open logic here
    console.log('Notifications opened');
  }

  openProfile(): void {
    // Implement profile open logic here
    console.log('Profile opened');
  }

  navigateToPage(pageId: string): void {
    const navItem = this.navItems.find(item => item.id === pageId);
    if (navItem) {
      this.updateActiveNavItem(navItem.route);
      this.router.navigate([navItem.route]);
    }
  }

  private updateActiveNavItem(currentRoute: string): void {
    this.navItems.forEach(item => {
      item.active = item.route === currentRoute ||
                   (item.id === 'dashboard' && currentRoute === '/client-dashboard');
    });
  }

  // Cart functionality - now delegates to CartService
  addToCart(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  // Modal functionality for checkout
  openCheckoutModal(): void {
    // This will be implemented when we create the CheckoutModalComponent
    console.log('Checkout modal opened');
  }

  // Loading state management
  isLoading = false;

  // Method to show/hide loading (can be called by child components)
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }
}
