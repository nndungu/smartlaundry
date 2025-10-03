 // register.component.ts
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth'; // Fixed import path
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserCredential } from '@angular/fire/auth'; // Added UserCredential import

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf]
})
export class RegisterComponent {
  selectedRole = '';
  showRoleDropdown = false;
  showPassword = false;
  showConfirmPassword = false;
  termsAgreed = false;

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminPasscode: ''
  };

  validationErrors: {[key: string]: string} = {};

  roles = [
    {
      value: 'customer',
      label: 'Customer',
      icon: '👥'
    },
    {
      value: 'driver',
      label: 'Driver',
      icon: '🏪'
    },
    {
      value: 'admin',
      label: 'Administrator',
      icon: '🛡️'
    }
  ];

  constructor(private router: Router, private authService: AuthService) {} // Added AuthService injection

  // Computed properties
  get isFormValid(): boolean {
    return !!(this.selectedRole && this.termsAgreed);
  }

  // Methods
  toggleRoleDropdown(event: Event): void {
    event.stopPropagation();
    this.showRoleDropdown = !this.showRoleDropdown;
  }

  selectRole(role: any): void {
    this.selectedRole = role.value;
    this.showRoleDropdown = false;
  }

  getRoleId(role: string): number {
    switch (role) {
      case 'customer': return 1;
      case 'driver': return 2;
      case 'admin': return 3;
      default: return 1;
    }
  }

  getRoleLabel(value: string): string {
    const role = this.roles.find(r => r.value === value);
    return role ? role.label : '';
  }

  getRoleIcon(value: string): string {
    const role = this.roles.find(r => r.value === value);
    return role ? role.icon : '';
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    // Clear previous errors
    this.validationErrors = {};

    // Validate role selection
    if (!this.selectedRole) {
      this.validationErrors['role'] = 'Role is required';
    }

    // Validate terms agreement
    if (!this.termsAgreed) {
      this.validationErrors['terms'] = 'You must agree to the terms and conditions';
    }

    // Validate required fields
    if (!this.formData.firstName.trim()) {
      this.validationErrors['firstName'] = 'First name is required';
    }

    if (!this.formData.lastName.trim()) {
      this.validationErrors['lastName'] = 'Last name is required';
    }

    if (!this.formData.email.trim()) {
      this.validationErrors['email'] = 'Email is required';
    } else if (!this.isEmailValid()) {
      this.validationErrors['email'] = 'Please enter a valid email address';
    }

    if (!this.formData.phone.trim()) {
      this.validationErrors['phone'] = 'Phone number is required';
    }

    if (!this.formData.password.trim()) {
      this.validationErrors['password'] = 'Password is required';
    } else if (this.formData.password.length < 8) {
      this.validationErrors['password'] = 'Password must be at least 8 characters long';
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Passwords do not match';
    }

    if (this.selectedRole === 'admin' && !this.formData.adminPasscode.trim()) {
      this.validationErrors['adminPasscode'] = 'Admin passcode is required for administrator role';
    }

    // If there are validation errors, don't proceed
    if (Object.keys(this.validationErrors).length > 0) {
      return;
    }

    // Prepare form data
    const registrationData = {
      fullName: `${this.formData.firstName.trim()} ${this.formData.lastName.trim()}`,
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      passwordHash: this.formData.password,
      role: { id: this.getRoleId(this.selectedRole) },
      isActive: true
    };

    console.log('Registration data:', registrationData);

    // Use AuthService to register user with API
    this.authService.register(registrationData)
      .pipe(
        catchError(error => {
          alert('Registration failed: ' + (error.message || 'Unknown error'));
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert('Registration successful! Please check your email for verification.');
          this.router.navigate(['/login']);
        }
      });
  }

  signInWithGoogle(): void {
    console.log('Google sign-in initiated');
    // Here you would typically integrate with Google OAuth
    // Example: this.authService.signInWithGoogle()
    alert('Google sign-in functionality would be implemented here');
  }

  // Validation methods
  private isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.formData.email);
  }

  private isPasswordStrong(): boolean {
    const password = this.formData.password;
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  private isPhoneValid(): boolean {
    const phoneRegex = /^\+?[\d\s\(\)-]{10,}$/;
    return phoneRegex.test(this.formData.phone);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showRoleDropdown = false;
    }
  }
}
