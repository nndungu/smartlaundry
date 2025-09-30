import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  service: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  public cartItems$ = this.cartItemsSubject.asObservable();
  public cartTotal$ = this.cartTotalSubject.asObservable();

  private readonly CART_STORAGE_KEY = 'laundryCart';

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(cartItems);
      this.updateTotal();
    }
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartItems));
  }

  private updateTotal(): void {
    const currentItems = this.cartItemsSubject.value;
    const total = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotalSubject.next(total);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartTotalSubject.value;
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push({ ...item });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage(currentItems);
    this.updateTotal();
  }

  removeFromCart(itemId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
    this.updateTotal();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(cartItem => cartItem.id === itemId);

    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.saveCartToStorage(currentItems);
      this.updateTotal();
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.cartTotalSubject.next(0);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
}
