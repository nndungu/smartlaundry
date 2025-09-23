import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { DashboardLayoutComponent, CartItem } from '../../../../shared/components/dashboard-layout/dashboard-layout';

interface LaundryPackage {
  id: string;
  name: string;
  description: string;
  size: string;
  bagCount: number;
  bagSize: string;
  idealFor: string;
  timesSaved: string;
  price: number;
  originalPrice?: number;
  currency: string;
  popular: boolean;
  image?: string;
  features: string[];
}

interface LaundryItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  onSale: boolean;
  category?: string;
}

interface Addon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.html',
  styleUrls: ['./book-service.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe]
})
export class BookingServiceComponent implements OnInit {

  // Form and UI state
  bookingForm!: FormGroup;
  showBookingForm = false;
  selectedPackage: LaundryPackage | null = null;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 16;
  totalItems = 39;

  // Data arrays
  laundryPackages: LaundryPackage[] = [];
  laundryItems: LaundryItem[] = [];
  addons: Addon[] = [];
  timeSlots: string[] = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(DashboardLayoutComponent) private dashboardLayout: DashboardLayoutComponent
  ) {
    this.initializeForm();
    this.initializeData();
  }

  ngOnInit(): void {
    // Component initialization
  }

  // Initialize reactive form
  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+254\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      addons: [[]],
      specialInstructions: ['']
    });
  }

  // Initialize sample data
  private initializeData(): void {
    this.laundryPackages = [
      {
        id: 'small',
        name: 'Small Package',
        description: 'Perfect for individuals or couples',
        size: 'Small',
        bagCount: 1,
        bagSize: 'Medium',
        idealFor: 'individuals or couples',
        timesSaved: 'Save 2-3 hours per week',
        price: 1500,
        originalPrice: 2000,
        currency: 'KSh',
        popular: false,
        features: ['Wash & Fold', 'Free Pickup & Delivery', '24-48 hour turnaround']
      },
      {
        id: 'medium',
        name: 'Medium Package',
        description: 'Great for small families',
        size: 'Medium',
        bagCount: 2,
        bagSize: 'Large',
        idealFor: 'small families',
        timesSaved: 'Save 4-5 hours per week',
        price: 2500,
        originalPrice: 3000,
        currency: 'KSh',
        popular: true,
        features: ['Wash & Fold', 'Free Pickup & Delivery', '24-48 hour turnaround', 'Stain Treatment']
      },
      {
        id: 'large',
        name: 'Large Package',
        description: 'Best for large families',
        size: 'Large',
        bagCount: 3,
        bagSize: 'Extra Large',
        idealFor: 'large families',
        timesSaved: 'Save 6+ hours per week',
        price: 3500,
        originalPrice: 4500,
        currency: 'KSh',
        popular: false,
        features: ['Wash & Fold', 'Free Pickup & Delivery', '24-48 hour turnaround', 'Stain Treatment', 'Express Service']
      }
    ];

    this.laundryItems = [
      { id: '1', name: '2 Piece Suit', price: 650, onSale: false },
      { id: '2', name: '3 Piece Suit', price: 700, onSale: false },
      { id: '3', name: 'African Attire', price: 900, originalPrice: 1000, onSale: true },
      { id: '4', name: 'Baby Dress', price: 400, originalPrice: 450, onSale: true },
      { id: '5', name: 'Baby Jacket', price: 350, originalPrice: 400, onSale: true },
      { id: '6', name: 'Bed Cover (Big)', price: 1000, originalPrice: 1200, onSale: true },
      { id: '7', name: 'Bed Sheet (Single)', price: 250, originalPrice: 300, onSale: true },
      { id: '8', name: 'Buibui', price: 900, originalPrice: 950, onSale: true },
      { id: '9', name: 'Carpet (Per sqm)', price: 30, originalPrice: 40, onSale: true },
      { id: '10', name: 'Curtains (Per Kg)', price: 600, originalPrice: 650, onSale: true },
      { id: '11', name: 'Cushion cover', price: 200, originalPrice: 250, onSale: true },
      { id: '12', name: 'Duvet (Medium)', price: 600, originalPrice: 650, onSale: true },
      { id: '13', name: 'Duvet (Small)', price: 600, originalPrice: 650, onSale: true },
      { id: '14', name: 'Formal Trouser', price: 400, originalPrice: 430, onSale: true },
      { id: '15', name: 'Graduation Gown', price: 900, originalPrice: 950, onSale: true },
      { id: '16', name: 'Hand Towel', price: 200, originalPrice: 250, onSale: true },

      { id: '17', name: 'Shirt (Cotton)', price: 250, onSale: false },
      { id: '18', name: 'Blouse', price: 300, originalPrice: 350, onSale: true },
      { id: '19', name: 'Jeans', price: 350, onSale: false },
      { id: '20', name: 'Dress (Simple)', price: 450, originalPrice: 500, onSale: true },
      { id: '21', name: 'T-Shirt', price: 200, onSale: false },
      { id: '22', name: 'Polo Shirt', price: 300, onSale: false },
      { id: '23', name: 'Sweater', price: 400, originalPrice: 450, onSale: true },
      { id: '24', name: 'Cardigan', price: 500, originalPrice: 550, onSale: true },
      { id: '25', name: 'Jacket (Light)', price: 600, originalPrice: 650, onSale: true },
      { id: '26', name: 'Skirt', price: 350, onSale: false },
      { id: '27', name: 'Shorts', price: 250, onSale: false },
      { id: '28', name: 'Cap', price: 150, onSale: false },
      { id: '29', name: 'Scarf', price: 180, onSale: false },
      { id: '30', name: 'Gloves', price: 200, onSale: false },
      { id: '31', name: 'Socks (Pair)', price: 100, onSale: false },
      { id: '32', name: 'Underwear', price: 120, onSale: false },
      { id: '33', name: 'Pajamas', price: 400, originalPrice: 450, onSale: true },
      { id: '34', name: 'Bathrobe', price: 500, originalPrice: 550, onSale: true },
      { id: '35', name: 'Towel Set', price: 300, originalPrice: 350, onSale: true },
      { id: '36', name: 'Table Cloth', price: 250, originalPrice: 300, onSale: true },
      { id: '37', name: 'Napkins (Set of 4)', price: 150, originalPrice: 200, onSale: true },
      { id: '38', name: 'Apron', price: 200, onSale: false },
      { id: '39', name: 'Chef Coat', price: 400, originalPrice: 450, onSale: true }
    ];

    this.addons = [
      { id: 'express', name: 'Express Service (Same Day)', price: 500 },
      { id: 'stain', name: 'Stain Treatment', price: 200 },
      { id: 'ironing', name: 'Professional Ironing', price: 300 },
      { id: 'folding', name: 'Premium Folding', price: 150 }
    ];
  }

  // Package selection methods
  selectPackage(pkg: LaundryPackage): void {
    this.selectedPackage = pkg;
    this.showBookingForm = true;
    // Scroll to booking form
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  trackByPackageId(index: number, pkg: LaundryPackage): string {
    return pkg.id;
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getCurrentPageItems(): LaundryItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.laundryItems.slice(startIndex, endIndex);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.totalItems);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top of laundry basket section
      document.getElementById('laundry-basket')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(2, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages - 1, this.currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (start === 2 && end < this.totalPages - 1) {
      end = Math.min(this.totalPages - 1, start + maxVisible - 1);
    }
    if (end === this.totalPages - 1 && start > 2) {
      start = Math.max(2, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== this.totalPages) {
        pages.push(i);
      }
    }

    return pages;
  }

  showStartEllipsis(): boolean {
    return this.currentPage > 4;
  }

  showEndEllipsis(): boolean {
    return this.currentPage < this.totalPages - 3;
  }

  // Cart management methods - now using shared cart
  addToBasket(item: LaundryItem): void {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      service: 'Laundry Service'
    };

    this.dashboardLayout.addToCart(cartItem);
  }

  getCartItems(): CartItem[] {
    return this.dashboardLayout.cartItems;
  }

  getCartTotal(): number {
    return this.dashboardLayout.getCartTotal();
  }

  removeFromCart(itemId: string): void {
    this.dashboardLayout.removeFromCart(itemId);
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    this.dashboardLayout.updateCartItemQuantity(itemId, quantity);
  }

  // Form validation methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) return 'Please enter a valid phone number (+254XXXXXXXXX)';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Addon management
  onAddonChange(addonId: string, event: any): void {
    const addonsArray = this.bookingForm.get('addons')?.value || [];

    if (event.target.checked) {
      if (!addonsArray.includes(addonId)) {
        addonsArray.push(addonId);
      }
    } else {
      const index = addonsArray.indexOf(addonId);
      if (index > -1) {
        addonsArray.splice(index, 1);
      }
    }

    this.bookingForm.patchValue({ addons: addonsArray });
  }

  // Price calculations
  calculateTotal(): number {
    if (!this.selectedPackage) return 0;

    let total = this.selectedPackage.price;

    // Add addon prices
    const selectedAddons = this.bookingForm.get('addons')?.value || [];
    selectedAddons.forEach((addonId: string) => {
      const addon = this.addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.price;
      }
    });

    return total;
  }

  calculateGrandTotal(): number {
    return this.calculateTotal() + this.getCartTotal();
  }

  // Form submission
  onSubmit(): void {
    if (this.bookingForm.valid && this.selectedPackage) {
      const bookingData = {
        package: this.selectedPackage,
        customerInfo: this.bookingForm.value,
        cartItems: this.getCartItems(),
        addons: this.bookingForm.get('addons')?.value || [],
        totalAmount: this.calculateGrandTotal()
      };

      console.log('Booking Data:', bookingData);

      // Here you would typically send the data to your backend service
      // this.bookingService.createBooking(bookingData).subscribe(...)

      alert('Booking submitted successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  // Reset form and selections
  resetForm(): void {
    this.bookingForm.reset();
    this.selectedPackage = null;
    this.showBookingForm = false;
    this.currentPage = 1;
  }
}
