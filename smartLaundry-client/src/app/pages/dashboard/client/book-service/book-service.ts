import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface LaundryPackage {
  id: number;
  name: string;
  size: string;
  description: string;
  features: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  timesSaved: string;
  bagCount: number;
  bagSize: string;
  idealFor: string;
  popular?: boolean;
  image?: string;
}

export interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  packageId: number;
  pickupDate: string;
  pickupTime: string;
  specialInstructions?: string;
  addons: string[];
}

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './book-service.html',
  styleUrls: ['./book-service.scss']
})
export class BookServiceComponent implements OnInit {

  bookingForm!: FormGroup;
  selectedPackage: LaundryPackage | null = null;
  showBookingForm = false;

  laundryPackages: LaundryPackage[] = [
    {
      id: 1,
      name: 'Individual Package',
      size: 'Small',
      description: 'Perfect for individuals and light laundry needs',
      features: [
        'Free pickup and delivery',
        'Professional washing and folding',
        'Same day service available',
        'Eco-friendly detergents',
        'Quality guarantee'
      ],
      price: 800,
      originalPrice: 1000,
      currency: 'KSh',
      timesSaved: '5+ hours every month',
      bagCount: 1,
      bagSize: 'suit size',
      idealFor: 'individual needs',
      image: '/assets/images/individual-package.jpg'
    },
    {
      id: 2,
      name: 'Couple Package',
      size: 'Medium',
      description: 'Ideal for couples and small households',
      features: [
        'Free pickup and delivery',
        'Professional washing and folding',
        'Priority processing',
        'Stain removal included',
        'Same day service available',
        'Quality guarantee'
      ],
      price: 1500,
      originalPrice: 1800,
      currency: 'KSh',
      timesSaved: '8+ hours every month',
      bagCount: 2,
      bagSize: 'suit size',
      idealFor: 'couples',
      popular: true,
      image: '/assets/images/couple-package.jpg'
    },
    {
      id: 3,
      name: 'Family Package',
      size: 'Large',
      description: 'Great for families with regular laundry needs',
      features: [
        'Free pickup and delivery',
        'Professional washing and folding',
        'Priority processing',
        'Advanced stain removal',
        'Fabric softener included',
        'Same day service available',
        'Quality guarantee',
        'Customer support'
      ],
      price: 2200,
      originalPrice: 2600,
      currency: 'KSh',
      timesSaved: '10+ hours every month',
      bagCount: 3,
      bagSize: 'large size',
      idealFor: 'families',
      image: '/assets/images/family-package.jpg'
    },
    {
      id: 4,
      name: 'Premium Package',
      size: 'Extra Large',
      description: 'Perfect for big families or commercial establishments',
      features: [
        'Free pickup and delivery',
        'Premium washing and folding',
        'Express processing',
        'Professional stain removal',
        'Premium fabric care',
        'Ironing service included',
        'Same day service available',
        'Dedicated customer support',
        'Quality guarantee',
        'Loyalty rewards'
      ],
      price: 3000,
      originalPrice: 3500,
      currency: 'KSh',
      timesSaved: '12+ hours every month',
      bagCount: 4,
      bagSize: 'large size',
      idealFor: 'big families or commercial establishment',
      image: '/assets/images/premium-package.jpg'
    }
  ];

  addons = [
    { id: 'express', name: 'Express Service (2-4 hours)', price: 300 },
    { id: 'ironing', name: 'Professional Ironing', price: 200 },
    { id: 'starch', name: 'Light Starch', price: 100 },
    { id: 'hangers', name: 'Return on Hangers', price: 150 },
    { id: 'fragrance', name: 'Premium Fragrance', price: 80 }
  ];

  timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.bookingForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[\d\s\-\(\)]{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      packageId: [null, Validators.required],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      specialInstructions: [''],
      addons: [[]]
    });
  }

  selectPackage(laundryPackage: LaundryPackage): void {
    this.selectedPackage = laundryPackage;
    this.bookingForm.patchValue({ packageId: laundryPackage.id });
    this.showBookingForm = true;
    
    // Scroll to booking form
    setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.selectedPackage) {
      const formData: BookingFormData = this.bookingForm.value;
      console.log('Booking submitted:', formData);
      
      // Here you would typically send the data to your backend service
      this.processBooking(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private processBooking(formData: BookingFormData): void {
    // Simulate API call
    console.log('Processing booking...', formData);
    
    // Show success message or redirect
    alert(`Thank you ${formData.customerName}! Your booking for ${this.selectedPackage?.name} has been confirmed. We'll contact you shortly.`);
    
    // Reset form
    this.resetForm();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset();
    this.selectedPackage = null;
    this.showBookingForm = false;
    
    // Scroll back to packages
    setTimeout(() => {
      const packagesElement = document.getElementById('laundry-packages');
      if (packagesElement) {
        packagesElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  calculateTotal(): number {
    if (!this.selectedPackage) return 0;
    
    let total = this.selectedPackage.price;
    const selectedAddons = this.bookingForm.get('addons')?.value || [];
    
    selectedAddons.forEach((addonId: string) => {
      const addon = this.addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.price;
      }
    });
    
    return total;
  }

  getMinDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  onAddonChange(addonId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const currentAddons = this.bookingForm.get('addons')?.value || [];
    
    if (target.checked) {
      // Add addon if not already included
      if (!currentAddons.includes(addonId)) {
        this.bookingForm.patchValue({
          addons: [...currentAddons, addonId]
        });
      }
    } else {
      // Remove addon
      const updatedAddons = currentAddons.filter((id: string) => id !== addonId);
      this.bookingForm.patchValue({
        addons: updatedAddons
      });
    }
  }

  trackByPackageId(index: number, item: LaundryPackage): number {
    return item.id;
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }
}