import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: {
    streetAddress: string;
    city: string;
    zipCode: string;
  };
  profilePicture?: string;
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  hasUnsavedChanges = false;

  // Profile picture management
  currentProfilePicture = 'assets/home1.webp';
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  isUploadingImage = false;

  private destroy$ = new Subject<void>();
  private originalFormData: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: this.fb.group({
        streetAddress: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]]
      })
    });

    // Track form changes
    this.profileForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hasUnsavedChanges = this.hasFormChanged();
      });
  }

  private hasFormChanged(): boolean {
    if (!this.originalFormData) return false;
    return JSON.stringify(this.profileForm.value) !== JSON.stringify(this.originalFormData);
  }

  private loadProfileData(): void {
    this.isLoading = true;

    // Simulate API call - replace with actual service call
    setTimeout(() => {
      const mockData: ProfileData = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        address: {
          streetAddress: '123 Main Street',
          city: 'New York',
          zipCode: '10001'
        },
        profilePicture: this.currentProfilePicture
      };

      this.profileForm.patchValue(mockData);
      this.originalFormData = this.profileForm.value;
      this.isLoading = false;
    }, 1500);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      this.generateImagePreview(file);
    }
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  confirmImageUpload(): void {
    if (this.selectedImageFile && this.imagePreview) {
      this.isUploadingImage = true;

      // Simulate upload - replace with actual upload service
      setTimeout(() => {
        this.currentProfilePicture = this.imagePreview ?? this.currentProfilePicture;
        this.selectedImageFile = null;
        this.imagePreview = null;
        this.isUploadingImage = false;
        this.snackBar.open('Profile picture updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 2000);
    }
  }

  cancelImageUpload(): void {
    this.selectedImageFile = null;
    this.imagePreview = null;
  }

  onSave(): void {
    if (this.profileForm.valid && this.hasUnsavedChanges) {
      this.isSaving = true;

      const formData = {
        ...this.profileForm.value,
        profilePicture: this.currentProfilePicture
      };

      // Simulate API call - replace with actual service call
      setTimeout(() => {
        this.originalFormData = this.profileForm.value;
        this.hasUnsavedChanges = false;
        this.isSaving = false;

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, 2000);
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges) {
      this.profileForm.patchValue(this.originalFormData);
      this.hasUnsavedChanges = false;
      this.snackBar.open('Changes cancelled', 'Close', {
        duration: 2000,
        panelClass: ['info-snackbar']
      });
    }
  }

  // Validation helper methods
  getFieldError(fieldName: string): string {
    if (!fieldName) return '';

    const field = this.getField(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'phoneNumber') {
        return 'Please enter a valid phone number';
      }
      if (fieldName === 'zipCode') {
        return 'Please enter a valid ZIP code';
      }
    }
    return '';
  }

  private getField(fieldName: string): AbstractControl | null {
    if (fieldName.includes('.')) {
      return this.profileForm.get(fieldName);
    }
    return this.profileForm.get(fieldName);
  }

  private getFieldLabel(fieldName: string | null): string {
    if (!fieldName) return '';

    const labels: Record<string, string> = {
      fullName: 'Full Name',
      email: 'Email Address',
      phoneNumber: 'Phone Number',
      'address.streetAddress': 'Street Address',
      'address.city': 'City',
      'address.zipCode': 'ZIP Code'
    };

    if (labels.hasOwnProperty(fieldName)) {
      return labels[fieldName];
    }

    // Fallback: capitalize first letter
    if (fieldName.length === 0) return fieldName;
    const firstChar = fieldName.charAt(0);
    const rest = fieldName.slice(1);
    return firstChar.toUpperCase() + rest;
  }

  // Template helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.getField(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  get isFormValid(): boolean {
    return this.profileForm.valid && this.hasUnsavedChanges;
  }

  get canCancel(): boolean {
    return this.hasUnsavedChanges && !this.isSaving;
  }

  // Helper method to focus fields (for mobile interaction)
  focusField(fieldName: string): void {
    // This method can be used to programmatically focus fields
    // For now, it's a placeholder for future implementation
    console.log(`Focus field: ${fieldName}`);
  }
}
