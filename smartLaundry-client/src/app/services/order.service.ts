import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Order {
  id: string;
  referenceNumber: string;
  dateTime: Date;
  serviceTypes: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  totalPrice: number;
  items: OrderItem[];
  pickupDate?: Date;
  deliveryDate?: Date;
  paymentMethod: string;
  statusTimeline: {
    picked: Date | null;
    washing: Date | null;
    delivered: Date | null;
  };
  feedback?: {
    rating: number;
    comment: string;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  serviceType: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private activeOrdersSubject = new BehaviorSubject<Order[]>([]);
  private orderHistorySubject = new BehaviorSubject<Order[]>([]);

  public activeOrders$ = this.activeOrdersSubject.asObservable();
  public orderHistory$ = this.orderHistorySubject.asObservable();

  private readonly ACTIVE_ORDERS_KEY = 'activeOrders';
  private readonly ORDER_HISTORY_KEY = 'orderHistory';

  constructor() {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const activeOrders = localStorage.getItem(this.ACTIVE_ORDERS_KEY);
    const orderHistory = localStorage.getItem(this.ORDER_HISTORY_KEY);

    if (activeOrders) {
      const orders = JSON.parse(activeOrders);
      // Convert date strings back to Date objects
      const parsedOrders = orders.map((order: any) => ({
        ...order,
        dateTime: new Date(order.dateTime),
        pickupDate: order.pickupDate ? new Date(order.pickupDate) : undefined,
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
        statusTimeline: {
          picked: order.statusTimeline.picked ? new Date(order.statusTimeline.picked) : null,
          washing: order.statusTimeline.washing ? new Date(order.statusTimeline.washing) : null,
          delivered: order.statusTimeline.delivered ? new Date(order.statusTimeline.delivered) : null,
        }
      }));
      this.activeOrdersSubject.next(parsedOrders);
    }

    if (orderHistory) {
      const orders = JSON.parse(orderHistory);
      const parsedOrders = orders.map((order: any) => ({
        ...order,
        dateTime: new Date(order.dateTime),
        pickupDate: order.pickupDate ? new Date(order.pickupDate) : undefined,
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
        statusTimeline: {
          picked: order.statusTimeline.picked ? new Date(order.statusTimeline.picked) : null,
          washing: order.statusTimeline.washing ? new Date(order.statusTimeline.washing) : null,
          delivered: order.statusTimeline.delivered ? new Date(order.statusTimeline.delivered) : null,
        }
      }));
      this.orderHistorySubject.next(parsedOrders);
    }
  }

  private saveOrdersToStorage(): void {
    localStorage.setItem(this.ACTIVE_ORDERS_KEY, JSON.stringify(this.activeOrdersSubject.value));
    localStorage.setItem(this.ORDER_HISTORY_KEY, JSON.stringify(this.orderHistorySubject.value));
  }

  getActiveOrders(): Order[] {
    return this.activeOrdersSubject.value;
  }

  getOrderHistory(): Order[] {
    return this.orderHistorySubject.value;
  }

  createOrder(orderData: {
    items: OrderItem[];
    paymentMethod: string;
    pickupDate?: Date;
    deliveryDate?: Date;
    serviceTypes: string[];
  }): Observable<Order> {
    // This would typically make an API call, but for now we'll simulate it
    return new Observable(observer => {
      setTimeout(() => {
        const newOrder: Order = {
          id: 'ORD-' + Date.now(),
          referenceNumber: 'SL-' + Date.now(),
          dateTime: new Date(),
          serviceTypes: orderData.serviceTypes,
          status: 'Pending',
          totalPrice: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          items: orderData.items,
          pickupDate: orderData.pickupDate,
          deliveryDate: orderData.deliveryDate,
          paymentMethod: orderData.paymentMethod,
          statusTimeline: {
            picked: null,
            washing: null,
            delivered: null,
          }
        };

        const currentActive = this.activeOrdersSubject.value;
        this.activeOrdersSubject.next([...currentActive, newOrder]);
        this.saveOrdersToStorage();

        observer.next(newOrder);
        observer.complete();
      }, 1000); // Simulate API delay
    });
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const currentActive = this.activeOrdersSubject.value;
    const orderIndex = currentActive.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
      const order = currentActive[orderIndex];
      order.status = status;

      // Update timeline based on status
      const now = new Date();
      if (status === 'In Progress') {
        order.statusTimeline.washing = now;
      } else if (status === 'Completed') {
        order.statusTimeline.delivered = now;
        // Move to history
        const currentHistory = this.orderHistorySubject.value;
        this.orderHistorySubject.next([...currentHistory, order]);
        // Remove from active
        currentActive.splice(orderIndex, 1);
      }

      this.activeOrdersSubject.next([...currentActive]);
      this.saveOrdersToStorage();
    }
  }

  getOrderById(orderId: string): Order | undefined {
    const activeOrder = this.activeOrdersSubject.value.find(order => order.id === orderId);
    if (activeOrder) return activeOrder;

    return this.orderHistorySubject.value.find(order => order.id === orderId);
  }

  submitFeedback(orderId: string, rating: number, comment: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentHistory = this.orderHistorySubject.value;
        const order = currentHistory.find(o => o.id === orderId);

        if (order) {
          order.feedback = { rating, comment };
          this.orderHistorySubject.next([...currentHistory]);
          this.saveOrdersToStorage();
        }

        observer.next();
        observer.complete();
      }, 500);
    });
  }
}
