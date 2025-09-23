import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { Subscription, filter } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  service: string;
}

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

  cartItems: CartItem[] = [];

  constructor(@Inject(Router) private router: Router, private authService: AuthService) {}

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

    // Set initial active item
    this.updateActiveNavItem(this.router.url);

    // Load cart from localStorage
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
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

  // Cart functionality
  private loadCart(): void {
    const savedCart = localStorage.getItem('laundryCart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCartCount();
    }
  }

  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }

    this.saveCart();
    this.updateCartCount();
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartCount();
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.saveCart();
        this.updateCartCount();
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem('laundryCart', JSON.stringify(this.cartItems));
  }

  private updateCartCount(): void {
    this.cartItemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemCount = 0;
    localStorage.removeItem('laundryCart');
  }

  // Loading state management
  isLoading = false;

  // Method to show/hide loading (can be called by child components)
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }
}
