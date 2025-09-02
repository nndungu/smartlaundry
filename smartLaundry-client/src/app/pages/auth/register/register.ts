// register.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, FormsModule]
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

  roles = [
    { 
      value: 'customer', 
      label: 'Customer', 
      icon: '👥'
    },
    { 
      value: 'provider', 
      label: 'Laundry Service Provider', 
      icon: '🏪'
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      icon: '🛡️'
    }
  ];

  constructor(private router: Router) {}

  // Computed properties
  get isFormValid(): boolean {
    return !!(this.selectedRole && this.termsAgreed);
  }

  // Methods
  toggleRoleDropdown(): void {
    this.showRoleDropdown = !this.showRoleDropdown;
  }

  selectRole(role: any): void {
    this.selectedRole = role.value;
    this.showRoleDropdown = false;
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
    if (!this.isFormValid) {
      return;
    }

    // Validate required fields
    if (!this.formData.firstName.trim()) {
      alert('First name is required');
      return;
    }

    if (!this.formData.lastName.trim()) {
      alert('Last name is required');
      return;
    }

    if (!this.formData.email.trim()) {
      alert('Email is required');
      return;
    }

    if (!this.isEmailValid()) {
      alert('Please enter a valid email address');
      return;
    }

    if (!this.formData.phone.trim()) {
      alert('Phone number is required');
      return;
    }

    if (!this.formData.password.trim()) {
      alert('Password is required');
      return;
    }

    if (this.formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.selectedRole === 'admin' && !this.formData.adminPasscode.trim()) {
      alert('Admin passcode is required for administrator role');
      return;
    }

    // Prepare form data
    const registrationData = {
      firstName: this.formData.firstName.trim(),
      lastName: this.formData.lastName.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      password: this.formData.password,
      role: this.selectedRole,
      ...(this.selectedRole === 'admin' && { adminPasscode: this.formData.adminPasscode })
    };

    console.log('Registration data:', registrationData);

    // Here you would typically call your authentication service
    // Example: this.authService.register(registrationData).subscribe(...)
    
    alert('Registration successful! Please check your email for verification.');
    
    // Redirect to login page
    this.router.navigate(['/login']);
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