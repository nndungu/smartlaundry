import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.scss']
})
export class ProfileUpdateComponent implements OnInit {
  isEditing = false;
  profileForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Sample user data - replace with actual data from service
  userData = {
    fullName: 'John Doe',
    email: 'johndoe@email.com',
    phone: '+254 712 345 678',
    address: 'Nairobi, Kenya',
    profileImage: 'assets/images/default-avatar.jpg'
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.profileForm.patchValue(this.userData);
    this.imagePreview = this.userData.profileImage;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData(); // Reset form if canceling
      this.selectedFile = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      // Update userData with form values
      this.userData = { ...this.userData, ...this.profileForm.value };
      
      // TODO: Send data to backend service
      console.log('Saving profile:', this.userData);
      console.log('Profile image file:', this.selectedFile);
      
      this.isEditing = false;
      
      // Show success message (implement toast/notification service)
      alert('Profile updated successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }
}