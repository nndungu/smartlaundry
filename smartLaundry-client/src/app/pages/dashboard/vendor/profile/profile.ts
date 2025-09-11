import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  notification: { type: string; message: string } | null = null;

  businessCategories = [
    'Motorcycle Delivery',
    'Taxi Service',
    'Courier Service',
    'Ride Sharing',
    'Logistics & Freight',
    'Public Transport',
    'Bike Rental',
    'Car Rental'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+254|0)[17]\d{8}$/)]],
      businessCategory: ['', Validators.required],
      businessDescription: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showNotification('error', 'Please select a valid image file.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('error', 'File size must be less than 5MB.');
        return;
      }

      this.selectedFile = file;
      this.createPreview(file);
    }
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isUploading = true;
      // Simulate API call
      setTimeout(() => {
        this.isUploading = false;
        this.showNotification('success', 'Profile updated successfully!');
      }, 2000);
    } else {
      this.showNotification('error', 'Please fill in all required fields correctly.');
    }
  }

  private showNotification(type: string, message: string): void {
    this.notification = { type, message };
    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be less than 500 characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
}
