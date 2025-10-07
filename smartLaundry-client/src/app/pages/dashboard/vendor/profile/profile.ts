import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface DriverProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  profilePhoto: string;
  vehicleType: 'bike' | 'car' | 'van';
  vehicleRegistration: string;
  licenseNumber: string;
  address: {
    city: string;
    street: string;
    houseNumber: string;
  };
}

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileUpdateComponent implements OnInit {
  profileForm: FormGroup;
  loading = true;
  submitting = false;
  error = '';
  success = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  vehicleTypes = [
    { value: 'bike', label: 'Motorcycle' },
    { value: 'car', label: 'Car' },
    { value: 'van', label: 'Van' }
  ];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDriverProfile();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Profile Info
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      
      // Vehicle Details
      vehicleType: ['', Validators.required],
      vehicleRegistration: ['', [Validators.required, Validators.minLength(3)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(5)]],
      
      // Address
      address: this.fb.group({
        city: ['', Validators.required],
        street: ['', Validators.required],
        houseNumber: ['', Validators.required]
      })
    });
  }

  async loadDriverProfile(): Promise<void> {
    try {
      this.loading = true;
      const driverId = this.getDriverId();
      const profile = await this.http.get<DriverProfile>(`/api/drivers/${driverId}`).toPromise();

      if (!profile) {
        this.error = 'Profile not found.';
        return;
      }

      this.populateForm(profile);
      this.imagePreview = profile.profilePhoto;
    } catch (error) {
      console.error('Error loading profile:', error);
      this.error = 'Failed to load profile data. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  populateForm(profile: DriverProfile): void {
    this.profileForm.patchValue({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      vehicleType: profile.vehicleType,
      vehicleRegistration: profile.vehicleRegistration,
      licenseNumber: profile.licenseNumber,
      address: {
        city: profile.address.city,
        street: profile.address.street,
        houseNumber: profile.address.houseNumber
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        this.error = 'Please select a valid image file (JPEG, PNG, etc.)';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB';
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    try {
      this.submitting = true;
      this.error = '';
      this.success = false;

      const formData = this.prepareFormData();
      const driverId = this.getDriverId();

      const updatedProfile = await this.http.patch<DriverProfile>(
        `/api/drivers/${driverId}`,
        formData
      ).toPromise();

      if (!updatedProfile) {
        this.error = 'Failed to update profile.';
        return;
      }

      this.success = true;
      this.populateForm(updatedProfile);
      
      // Reset file selection after successful upload
      this.selectedFile = null;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        this.success = false;
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      this.error = 'Failed to update profile. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Append form fields
    Object.keys(formValue).forEach(key => {
      if (key === 'address') {
        formData.append(key, JSON.stringify(formValue[key]));
      } else {
        formData.append(key, formValue[key]);
      }
    });

    // Append profile photo if selected
    if (this.selectedFile) {
      formData.append('profilePhoto', this.selectedFile);
    }

    return formData;
  }

  onReset(): void {
    this.loadDriverProfile();
    this.selectedFile = null;
    this.error = '';
    this.success = false;
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control instanceof FormGroup) {
        this.markNestedFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  markNestedFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getDriverId(): string {
    // In real implementation, get from auth service or token
    return localStorage.getItem('driverId') || 'current-driver';
  }

  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    if (field.errors['pattern']) return 'Please enter a valid phone number';

    return 'Invalid value';
  }

  getNestedFieldError(groupName: string, fieldName: string): string {
    const field = this.profileForm.get(`${groupName}.${fieldName}`);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    return 'Invalid value';
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.profileForm.get(`${groupName}.${fieldName}`);
    return !!(field && field.invalid && field.touched);
  }
}