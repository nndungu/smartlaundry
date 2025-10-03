// src/app/pages/auth/login/login.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthResponse } from '../../../models/auth/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,                                 
  imports: [                                         
    CommonModule,    // For ngClass, ngIf, etc.
    FormsModule,     // For ngModel
    RouterModule     // For routerLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  showPassword = false;
  rememberMe = false;
  isLoading = false;

  formData = {
    email: '',
    password: ''
  };

  // Error messages
  emailError = '';
  passwordError = '';
  generalError = '';
  successMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService // Added AuthService injection
  ) {}

  ngOnInit(): void {
    // Check for success message from registration
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Registration successful! Please sign in to your account.';
      }
      if (params['verified'] === 'true') {
        this.successMessage = 'Email verified successfully! Please sign in to your account.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Clear previous errors
    this.clearErrors();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.generalError = '';
    this.successMessage = '';

    // Use AuthService to perform login with API
    this.authService.login(this.formData.email.trim().toLowerCase(), this.formData.password)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.generalError = this.getErrorMessage(error);
          return of(null);
        })
      )
      .subscribe((response: AuthResponse | null) => {
        if (response) {
          this.isLoading = false;
          this.successMessage = 'Login successful! Redirecting to dashboard...';

          if (this.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        }
      });
  }

  private getErrorMessage(error: any): string {
    // Map API errors to user-friendly messages
    if (!error) {
      return 'An unknown error occurred. Please try again.';
    }
    if (error.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.status === 400) {
      return 'Invalid request. Please check your input.';
    }
    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }
    return error.error?.message || error.message || 'An error occurred during login.';
  }

  signInWithGoogle(): void {
    console.log('Google sign-in initiated');
    this.generalError = '';
    this.successMessage = '';

    // Here you would typically integrate with Google OAuth
    // Example: this.authService.signInWithGoogle().subscribe(...)

    // For demo purposes
    this.successMessage = 'Redirecting to Google sign-in...';

    // Simulate Google OAuth flow
    setTimeout(() => {
      alert('Google sign-in functionality would be implemented here');
      this.successMessage = '';
    }, 2000);
  }

  private validateForm(): boolean {
    let isValid = true;

    // Email validation
    if (!this.formData.email.trim()) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isEmailValid(this.formData.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.formData.password.trim()) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.formData.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long';
      isValid = false;
    }

    return isValid;
  }

  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearErrors(): void {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
    this.successMessage = '';
  }

  // Utility methods for testing different scenarios
  fillDemoCredentials(): void {
    this.formData.email = 'demo@laundrymart.com';
    this.formData.password = 'demo123';
    this.clearErrors();
  }

  // Keyboard event handlers
  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading) {
      this.onSubmit();
    }
  }
}
