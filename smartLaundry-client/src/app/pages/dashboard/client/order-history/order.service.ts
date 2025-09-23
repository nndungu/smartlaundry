import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Order, OrderItem } from './order-history';

export interface CreateOrderRequest {
  items: Omit<OrderItem, 'id'>[];
  paymentMethod: string;
}

export interface FeedbackRequest {
  orderId: string;
  rating: number;
  comment: string;
}

export interface ReportIssueRequest {
  orderId: string;
  issueType: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.orders = [
      {
        id: '1',
        referenceNumber: 'LND-2024-001',
        dateTime: new Date('2024-03-15T10:30:00'),
        serviceTypes: ['Wash', 'Dry'],
        status: 'Completed',
        totalPrice: 45.99,
        items: [
          { id: '1', name: 'Cotton Shirts', quantity: 3, price: 15.99, serviceType: 'Wash' },
          { id: '2', name: 'Jeans', quantity: 2, price: 20.00, serviceType: 'Wash' },
          { id: '3', name: 'Bedsheets', quantity: 1, price: 10.00, serviceType: 'Dry' }
        ],
        pickupDate: new Date('2024-03-15T14:00:00'),
        deliveryDate: new Date('2024-03-17T09:00:00'),
        paymentMethod: 'Credit Card',
        statusTimeline: {
          picked: new Date('2024-03-15T14:00:00'),
          washing: new Date('2024-03-16T08:00:00'),
          delivered: new Date('2024-03-17T09:00:00')
        }
      },
      {
        id: '2',
        referenceNumber: 'LND-2024-002',
        dateTime: new Date('2024-03-20T14:15:00'),
        serviceTypes: ['Dry Clean'],
        status: 'In Progress',
        totalPrice: 85.50,
        items: [
          { id: '4', name: 'Business Suit', quantity: 1, price: 45.00, serviceType: 'Dry Clean' },
          { id: '5', name: 'Silk Dress', quantity: 1, price: 40.50, serviceType: 'Dry Clean' }
        ],
        pickupDate: new Date('2024-03-20T16:00:00'),
        deliveryDate: new Date('2024-03-22T10:00:00'),
        paymentMethod: 'PayPal',
        statusTimeline: {
          picked: new Date('2024-03-20T16:00:00'),
          washing: new Date('2024-03-21T09:00:00'),
          delivered: null
        }
      },
      {
        id: '3',
        referenceNumber: 'LND-2024-003',
        dateTime: new Date('2024-03-22T09:00:00'),
        serviceTypes: ['Ironing'],
        status: 'Pending',
        totalPrice: 25.00,
        items: [
          { id: '6', name: 'Formal Shirts', quantity: 5, price: 25.00, serviceType: 'Ironing' }
        ],
        pickupDate: new Date('2024-03-22T15:00:00'),
        paymentMethod: 'Cash',
        statusTimeline: {
          picked: null,
          washing: null,
          delivered: null
        }
      },
      {
        id: '4',
        referenceNumber: 'LND-2024-004',
        dateTime: new Date('2024-03-25T11:45:00'),
        serviceTypes: ['Wash', 'Ironing'],
        status: 'Canceled',
        totalPrice: 35.00,
        items: [
          { id: '7', name: 'T-Shirts', quantity: 4, price: 20.00, serviceType: 'Wash' },
          { id: '8', name: 'Dress Shirts', quantity: 3, price: 15.00, serviceType: 'Ironing' }
        ],
        paymentMethod: 'Credit Card',
        statusTimeline: {
          picked: null,
          washing: null,
          delivered: null
        }
      },
      {
        id: '5',
        referenceNumber: 'LND-2024-005',
        dateTime: new Date('2024-03-28T09:15:00'),
        serviceTypes: ['Dry Clean', 'Ironing'],
        status: 'Completed',
        totalPrice: 95.00,
        items: [
          { id: '9', name: 'Wool Coat', quantity: 1, price: 60.00, serviceType: 'Dry Clean' },
          { id: '10', name: 'Formal Shirts', quantity: 7, price: 35.00, serviceType: 'Ironing' }
        ],
        pickupDate: new Date('2024-03-28T13:00:00'),
        deliveryDate: new Date('2024-03-30T10:00:00'),
        paymentMethod: 'Debit Card',
        statusTimeline: {
          picked: new Date('2024-03-28T13:00:00'),
          washing: new Date('2024-03-29T08:00:00'),
          delivered: new Date('2024-03-30T10:00:00')
        },
        feedback: {
          rating: 5,
          comment: 'Excellent service! Very satisfied with the quality.'
        }
      }
    ];
  }

  /**
   * Get all orders for the current user
   */
  getOrders(): Observable<Order[]> {
    // Simulate API delay
    return of(this.orders).pipe(delay(1500));
  }

  /**
   * Get a specific order by ID
   */
  getOrder(id: string): Observable<Order | null> {
    const order = this.orders.find(o => o.id === id);
    return of(order || null).pipe(delay(500));
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: string): Observable<Order[]> {
    const filteredOrders = this.orders.filter(order => order.status === status);
    return of(filteredOrders).pipe(delay(800));
  }

  /**
   * Create a new order (reorder functionality)
   */
  createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
    const newOrder: Order = {
      id: (this.orders.length + 1).toString(),
      referenceNumber: `LND-2024-${String(this.orders.length + 1).padStart(3, '0')}`,
      dateTime: new Date(),
      serviceTypes: [...new Set(orderRequest.items.map((item: any) => item.serviceType))],
      status: 'Pending',
      totalPrice: orderRequest.items.reduce((total: number, item: any) => total + item.price, 0),
      items: orderRequest.items.map((item: any, index: number) => ({
        ...item,
        id: `${this.orders.length + 1}-${index + 1}`
      })),
      paymentMethod: orderRequest.paymentMethod,
      statusTimeline: {
        picked: null,
        washing: null,
        delivered: null
      }
    };

    this.orders.push(newOrder);
    return of(newOrder).pipe(delay(1000));
  }

  /**
   * Submit feedback for an order
   */
  submitFeedback(feedbackRequest: FeedbackRequest): Observable<boolean> {
    const order = this.orders.find(o => o.id === feedbackRequest.orderId);

    if (!order) {
      return throwError(() => new Error('Order not found'));
    }

    if (order.status !== 'Completed') {
      return throwError(() => new Error('Can only provide feedback for completed orders'));
    }

    order.feedback = {
      rating: feedbackRequest.rating,
      comment: feedbackRequest.comment
    };

    return of(true).pipe(delay(800));
  }

  /**
   * Report an issue with an order
   */
  reportIssue(issueRequest: ReportIssueRequest): Observable<boolean> {
    const order = this.orders.find(o => o.id === issueRequest.orderId);

    if (!order) {
      return throwError(() => new Error('Order not found'));
    }

    // In a real implementation, this would create a support ticket
    console.log('Issue reported:', {
      order: order.referenceNumber,
      issueType: issueRequest.issueType,
      description: issueRequest.description,
      priority: issueRequest.priority,
      timestamp: new Date()
    });

    return of(true).pipe(delay(1000));
  }

  /**
   * Update order status (for admin/system use)
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);

    if (!order) {
      return throwError(() => new Error('Order not found'));
    }

    order.status = status;

    // Update timeline based on status
    const now = new Date();
    switch (status) {
      case 'In Progress':
        if (!order.statusTimeline.picked) {
          order.statusTimeline.picked = now;
        }
        break;
      case 'Completed':
        if (!order.statusTimeline.picked) {
          order.statusTimeline.picked = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        }
        if (!order.statusTimeline.washing) {
          order.statusTimeline.washing = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
        }
        order.statusTimeline.delivered = now;
        break;
    }

    return of(order).pipe(delay(500));
  }

  /**
   * Generate and download invoice
   */
  generateInvoice(orderId: string): Observable<Blob> {
    const order = this.orders.find(o => o.id === orderId);

    if (!order) {
      return throwError(() => new Error('Order not found'));
    }

    const invoiceContent = this.createInvoiceContent(order);
    const blob = new Blob([invoiceContent], { type: 'text/plain' });

    return of(blob).pipe(delay(800));
  }

  private createInvoiceContent(order: Order): string {
    const invoiceDate = new Date().toLocaleDateString();
    const orderDate = order.dateTime.toLocaleDateString();

    return `
SMART LAUNDRY SERVICE
=====================
INVOICE

Invoice Date: ${invoiceDate}
Order Reference: ${order.referenceNumber}
Order Date: ${orderDate}
Status: ${order.status}

CUSTOMER INFORMATION
-------------------
Payment Method: ${order.paymentMethod}

SERVICES & ITEMS
---------------
${order.items.map((item: OrderItem) =>
  `${item.name} (${item.serviceType})
  Quantity: ${item.quantity}
  Price: $${item.price.toFixed(2)}`
).join('\n\n')}

TIMELINE
--------
${order.pickupDate ? `Pickup: ${order.pickupDate.toLocaleDateString()} ${order.pickupDate.toLocaleTimeString()}` : 'Pickup: Scheduled'}
${order.deliveryDate ? `Delivery: ${order.deliveryDate.toLocaleDateString()} ${order.deliveryDate.toLocaleTimeString()}` : 'Delivery: Scheduled'}

PAYMENT SUMMARY
--------------
Subtotal: $${order.totalPrice.toFixed(2)}
Tax: $0.00
Total: $${order.totalPrice.toFixed(2)}

${order.feedback ? `
CUSTOMER FEEDBACK
----------------
Rating: ${order.feedback.rating}/5 stars
Comment: ${order.feedback.comment}
` : ''}

Thank you for choosing Smart Laundry Service!
For questions or support, please contact us at support@smartlaundry.com
    `.trim();
  }

  /**
   * Get order statistics
   */
  getOrderStatistics(): Observable<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    canceled: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    const stats = {
      total: this.orders.length,
      pending: this.orders.filter(o => o.status === 'Pending').length,
      inProgress: this.orders.filter(o => o.status === 'In Progress').length,
      completed: this.orders.filter(o => o.status === 'Completed').length,
      canceled: this.orders.filter(o => o.status === 'Canceled').length,
      totalSpent: this.orders.reduce((sum: number, order: Order) =>
        order.status === 'Completed' ? sum + order.totalPrice : sum, 0
      ),
      averageOrderValue: 0
    };

    const completedOrders = this.orders.filter(o => o.status === 'Completed');
    stats.averageOrderValue = completedOrders.length > 0
      ? stats.totalSpent / completedOrders.length
      : 0;

    return of(stats).pipe(delay(600));
  }
}
