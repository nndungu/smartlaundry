import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { OrderService, FeedbackRequest, ReportIssueRequest } from './order.service';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  serviceType: string;
}

export interface Order {
  id: string;
  referenceNumber: string;
  dateTime: Date;
  serviceTypes: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  totalPrice: number;
  currency?: string;  // Made optional
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

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.scss']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;

  // Loading states
  isLoading = true;
  isSubmittingFeedback = false;
  isReportingIssue = false;
  isReordering = false;
  isDownloadingInvoice = false;

  // Modal states
  showDetailModal = false;
  showFeedbackModal = false;
  showReportIssueModal = false;

  // Filter and sort options
  statusFilter = 'all';
  sortBy = 'dateDesc';

  // Forms
  feedbackForm = {
    rating: 5,
    comment: ''
  };

  reportIssueForm = {
    issueType: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  };

  // Error handling
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrders()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (orders: Order[]) => {
          // Add default currency and fix referenceNumber prefix
          this.orders = orders.map(order => {
            if (!order.currency) {
              order.currency = 'KSh';
            }
            if (order.referenceNumber.startsWith('LND-')) {
              order.referenceNumber = order.referenceNumber.replace('LND-', 'SL-');
            }
            return order;
          });
          this.filteredOrders = [...this.orders];
          this.applyFilters();
        },
        error: (error: any) => {
          console.error('Error loading orders:', error);
          this.errorMessage = 'Failed to load orders. Please try again.';
        }
      });
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.orders];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'dateDesc':
        filtered.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
        break;
      case 'dateAsc':
        filtered.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'priceAsc':
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
    }

    this.filteredOrders = filtered;
  }

  openOrderDetail(order: Order): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  reorder(order: Order): void {
    if (this.isReordering) return;

    this.isReordering = true;

    const orderRequest = {
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item['price'],
        serviceType: item['serviceType']
      })),
      paymentMethod: order.paymentMethod
    };

    this.orderService.createOrder(orderRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isReordering = false)
      )
      .subscribe({
        next: (newOrder: Order) => {
          alert(`Order ${newOrder.referenceNumber} has been created successfully!`);
          this.loadOrders(); // Refresh the orders list
        },
        error: (error: any) => {
          console.error('Error creating reorder:', error);
          alert('Failed to create reorder. Please try again.');
        }
      });
  }

  downloadInvoice(order: Order): void {
    if (this.isDownloadingInvoice) return;

    this.isDownloadingInvoice = true;

    this.orderService.generateInvoice(order.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isDownloadingInvoice = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const element = document.createElement('a');
          element.href = url;
          element.download = `invoice-${order.referenceNumber}.txt`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Error downloading invoice:', error);
          alert('Failed to download invoice. Please try again.');
        }
      });
  }

  openFeedbackModal(order: Order): void {
    this.selectedOrder = order;
    this.showFeedbackModal = true;
    this.feedbackForm = {
      rating: order.feedback?.rating || 5,
      comment: order.feedback?.comment || ''
    };
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.selectedOrder = null;
    this.feedbackForm = { rating: 5, comment: '' };
  }

  submitFeedback(): void {
    if (!this.selectedOrder || this.isSubmittingFeedback) return;

    this.isSubmittingFeedback = true;

    const feedbackRequest: FeedbackRequest = {
      orderId: this.selectedOrder.id,
      rating: this.feedbackForm.rating,
      comment: this.feedbackForm.comment
    };

    this.orderService.submitFeedback(feedbackRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmittingFeedback = false)
      )
      .subscribe({
        next: () => {
          if (this.selectedOrder) {
            this.selectedOrder.feedback = {
              rating: this.feedbackForm.rating,
              comment: this.feedbackForm.comment
            };
          }
          alert('Feedback submitted successfully!');
          this.closeFeedbackModal();
        },
        error: (error: any) => {
          console.error('Error submitting feedback:', error);
          alert('Failed to submit feedback. Please try again.');
        }
      });
  }

  openReportIssueModal(order: Order): void {
    this.selectedOrder = order;
    this.showReportIssueModal = true;
    this.reportIssueForm = {
      issueType: '',
      description: '',
      priority: 'medium'
    };
  }

  closeReportIssueModal(): void {
    this.showReportIssueModal = false;
    this.selectedOrder = null;
    this.reportIssueForm = { issueType: '', description: '', priority: 'medium' };
  }

  submitReportIssue(): void {
    if (!this.selectedOrder || !this.reportIssueForm.issueType ||
        !this.reportIssueForm.description || this.isReportingIssue) {
      return;
    }

    this.isReportingIssue = true;

    const issueRequest: ReportIssueRequest = {
      orderId: this.selectedOrder.id,
      issueType: this.reportIssueForm.issueType,
      description: this.reportIssueForm.description,
      priority: this.reportIssueForm.priority
    };

    this.orderService.reportIssue(issueRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isReportingIssue = false)
      )
      .subscribe({
        next: () => {
          alert('Issue reported successfully! We will contact you soon.');
          this.closeReportIssueModal();
        },
        error: (error: any) => {
          console.error('Error reporting issue:', error);
          alert('Failed to report issue. Please try again.');
        }
      });
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'Pending': 'status-pending',
      'In Progress': 'status-in-progress',
      'Completed': 'status-completed',
      'Canceled': 'status-canceled'
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  setRating(rating: number): void {
    this.feedbackForm.rating = rating;
  }

  getStarClass(index: number): string {
    return index < this.feedbackForm.rating ? 'star-filled' : 'star-empty';
  }

  retryLoadOrders(): void {
    this.loadOrders();
  }

  // Utility methods for template
  get hasOrders(): boolean {
    return this.orders.length > 0;
  }

  get hasFilteredOrders(): boolean {
    return this.filteredOrders.length > 0;
  }

  get isFormValid(): boolean {
    return this.reportIssueForm.issueType !== '' &&
           this.reportIssueForm.description.trim() !== '';
  }

  // Track by function for ngFor performance
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  trackByItemId(index: number, item: OrderItem): string {
    return item.id;
  }
}
