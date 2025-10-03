import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

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
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './prices.html',
  styleUrls: ['./prices.scss']
})
export class PricingComponent implements OnInit {

  pricingForm!: FormGroup;

  // Data arrays
  laundryPackages: LaundryPackage[] = [];
  laundryItems: LaundryItem[] = [];
  addons: Addon[] = [];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    this.initializeData();
  }

  ngOnInit(): void {
    // Component initialization
  }

  // Initialize reactive form
  private initializeForm(): void {
    this.pricingForm = this.fb.group({
      packages: this.fb.array([]),
      items: this.fb.array([]),
      addons: this.fb.array([])
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

    // Selected 12 frequently used items
    this.laundryItems = [
      { id: 'duvet-medium', name: 'Duvet (Medium)', price: 600, originalPrice: 650, onSale: true },
      { id: 'duvet-small', name: 'Duvet (Small)', price: 600, originalPrice: 650, onSale: true },
      { id: 'bed-cover-big', name: 'Bed Cover (Big)', price: 1000, originalPrice: 1200, onSale: true },
      { id: 'bed-sheet-single', name: 'Bed Sheet (Single)', price: 250, originalPrice: 300, onSale: true },
      { id: 'carpet', name: 'Carpet (Per sqm)', price: 30, originalPrice: 40, onSale: true },
      { id: 'curtains', name: 'Curtains (Per Kg)', price: 600, originalPrice: 650, onSale: true },
      { id: 'suit-2-piece', name: '2 Piece Suit', price: 650, onSale: false },
      { id: 'suit-3-piece', name: '3 Piece Suit', price: 700, onSale: false },
      { id: 'african-attire', name: 'African Attire', price: 900, originalPrice: 1000, onSale: true },
      { id: 'wedding-gown', name: 'Wedding Gown', price: 900, originalPrice: 950, onSale: true },
      { id: 'buibui', name: 'Buibui', price: 900, originalPrice: 950, onSale: true },
      { id: 'chef-coat', name: 'Chef Coat', price: 400, originalPrice: 450, onSale: true }
    ];

    this.addons = [
      { id: 'express', name: 'Express Service (Same Day)', price: 500 },
      { id: 'stain', name: 'Stain Treatment', price: 200 },
      { id: 'ironing', name: 'Professional Ironing', price: 300 },
      { id: 'folding', name: 'Premium Folding', price: 150 }
    ];

    // Initialize form arrays
    this.initializeFormArrays();
  }

  private initializeFormArrays(): void {
    // Initialize packages form array
    const packagesArray = this.pricingForm.get('packages') as FormArray;
    this.laundryPackages.forEach(pkg => {
      packagesArray.push(this.fb.group({
        id: [pkg.id],
        name: [pkg.name],
        price: [pkg.price, [Validators.required, Validators.min(0)]],
        originalPrice: [pkg.originalPrice]
      }));
    });

    // Initialize items form array
    const itemsArray = this.pricingForm.get('items') as FormArray;
    this.laundryItems.forEach(item => {
      itemsArray.push(this.fb.group({
        id: [item.id],
        name: [item.name],
        price: [item.price, [Validators.required, Validators.min(0)]],
        originalPrice: [item.originalPrice]
      }));
    });

    // Initialize addons form array
    const addonsArray = this.pricingForm.get('addons') as FormArray;
    this.addons.forEach(addon => {
      addonsArray.push(this.fb.group({
        id: [addon.id],
        name: [addon.name],
        price: [addon.price, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  // Get form arrays
  get packagesFormArray(): FormArray {
    return this.pricingForm.get('packages') as FormArray;
  }

  get itemsFormArray(): FormArray {
    return this.pricingForm.get('items') as FormArray;
  }

  get addonsFormArray(): FormArray {
    return this.pricingForm.get('addons') as FormArray;
  }

  // Form validation methods
  isFieldInvalid(formArrayName: string, index: number, fieldName: string): boolean {
    const formArray = this.pricingForm.get(formArrayName) as FormArray;
    const field = formArray.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(formArrayName: string, index: number, fieldName: string): string {
    const formArray = this.pricingForm.get(formArrayName) as FormArray;
    const field = formArray.at(index).get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  // Save pricing (placeholder for future API integration)
  onSavePricing(): void {
    if (this.pricingForm.valid) {
      console.log('Pricing data:', this.pricingForm.value);
      // TODO: Implement API call to save pricing
      alert('Pricing saved successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.pricingForm.controls).forEach(key => {
        const control = this.pricingForm.get(key);
        if (control instanceof FormArray) {
          control.controls.forEach(group => {
            if (group instanceof FormGroup) {
              Object.keys(group.controls).forEach(fieldKey => {
                group.get(fieldKey)?.markAsTouched();
              });
            }
          });
        }
      });
    }
  }

  // Reset form to original values
  onReset(): void {
    this.initializeData();
  }
}
