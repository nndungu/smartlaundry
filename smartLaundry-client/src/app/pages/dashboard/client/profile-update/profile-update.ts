import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../../models/customer.model';
import { CustomerService } from '../../../../services/customer-profile.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ProfileUpdateComponent implements OnInit {
  profileForm: FormGroup;
  customer: Customer | null = null;
  originalData: Customer | null = null;
  isLoading = false;
  isSaving = false;
  isUploading = false;
  selectedFile: File | null = null;
  avatarPreview: string | null = null;
  customerId = '123'; // This would typically come from route params or auth service

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCustomerProfile();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]]
      })
    });
  }

  private loadCustomerProfile(): void {
    this.isLoading = true;
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer: Customer) => {
        this.customer = customer;
        this.originalData = { ...customer };
        this.populateForm(customer);
        this.avatarPreview = customer.profilePictureUrl || 'assets/home1.webp';
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading customer profile:', error);
        this.showErrorMessage('Failed to load profile data');
        this.avatarPreview = 'assets/home1.webp';
        this.isLoading = false;
      }
    });
  }

  private populateForm(customer: Customer): void {
    this.profileForm.patchValue({
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: {
        street: customer.address.street,
        city: customer.address.city,
        zipCode: customer.address.zipCode
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showErrorMessage('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.showErrorMessage('Please select a valid image file');
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.customerService.uploadAvatar(this.customerId, this.selectedFile).subscribe({
      next: (response: any) => {
        this.avatarPreview = response.profilePictureUrl;
        this.showSuccessMessage('Profile picture updated successfully');
        this.selectedFile = null;
        this.isUploading = false;
      },
      error: (error: any) => {
        console.error('Error uploading avatar:', error);
        this.showErrorMessage('Failed to upload profile picture');
        this.isUploading = false;
      }
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      this.showErrorMessage('Please fix the form errors before saving');
      return;
    }

    this.isSaving = true;
    const formData = this.profileForm.value;
    
    const updateData: Partial<Customer> = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        zipCode: formData.address.zipCode
      }
    };

    this.customerService.updateCustomer(this.customerId, updateData).subscribe({
      next: (updatedCustomer: Customer) => {
        this.customer = updatedCustomer;
        this.originalData = { ...updatedCustomer };
        this.showSuccessMessage('Profile updated successfully');
        this.isSaving = false;
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.showErrorMessage('Failed to update profile');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    if (this.originalData) {
      this.populateForm(this.originalData);
      this.avatarPreview = this.originalData.profilePictureUrl || null;
      this.selectedFile = null;
      this.showSuccessMessage('Changes have been reset');
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return `Please enter a valid ${fieldName}`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  getAddressFieldError(fieldName: string): string {
    const field = this.profileForm.get(`address.${fieldName}`);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['pattern']) return `Please enter a valid ${fieldName}`;
    }
    return '';
  }
}