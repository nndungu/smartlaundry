import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  location: string;
  streetNumber: string;
  houseNumber?: string;
  apartment?: string;
}

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileUpdateComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Mock initial user data - in real app, this would come from a service
  private initialProfile: UserProfile = {
    location: 'Nairobi',
    streetNumber: '123',
    houseNumber: '45',
    apartment: 'Green Valley Apartments'
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      location: ['', [Validators.required, Validators.minLength(2)]],
      streetNumber: ['', [Validators.required]],
      houseNumber: [''],
      apartment: ['']
    });
  }

  ngOnInit(): void {
    // Simulate loading user profile data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // In a real application, this would be an API call
    setTimeout(() => {
      this.userProfile = { ...this.initialProfile };
      this.profileForm.patchValue(this.initialProfile);
      this.profileForm.markAsPristine();
    }, 500);
  }

  get location() {
    return this.profileForm.get('location');
  }

  get streetNumber() {
    return this.profileForm.get('streetNumber');
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate API call to update profile
    setTimeout(() => {
      this.isLoading = false;
      
      // Simulate random success/failure for demo purposes
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        this.userProfile = { ...this.profileForm.value };
        this.successMessage = 'Profile updated successfully!';
        this.profileForm.markAsPristine();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      } else {
        this.errorMessage = 'Failed to update profile. Please try again.';
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    }, 1500);
  }

  onCancel(): void {
    if (this.userProfile) {
      this.profileForm.patchValue(this.userProfile);
      this.profileForm.markAsPristine();
    } else {
      this.profileForm.reset();
    }
    this.successMessage = '';
    this.errorMessage = '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if form has unsaved changes
  hasUnsavedChanges(): boolean {
    return this.profileForm.dirty && !this.isLoading;
  }
}