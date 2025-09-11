// src/app/pages/auth/login/login.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';        
import { CommonModule } from '@angular/common';      
import { RouterModule } from '@angular/router';      
import { AuthService } from '../../../services/auth/auth'; // Fixed import path
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserCredential } from '@angular/fire/auth'; // Added UserCredential import

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

    // Use AuthService to perform login with Firebase
    this.authService.login(this.formData.email.trim().toLowerCase(), this.formData.password)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.generalError = this.getErrorMessage(error);
          return of(null);
        })
      )
      .subscribe((userCredential: UserCredential) => { // Typed userCredential
        if (userCredential) {
          this.isLoading = false;
          this.successMessage = 'Login successful! Redirecting to dashboard...';

          if (this.rememberMe) {
            localStorage.setItem('rememberMe', 'true'); // Added rememberMe localStorage
          }

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        }
      });
  }

  private getErrorMessage(error: any): string {
    // Map Firebase auth errors to user-friendly messages
    if (!error || !error.code) {
      return 'An unknown error occurred. Please try again.';
    }
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please try again.';
      case 'auth/user-disabled':
        return 'Your account has been temporarily locked. Please contact support.';
      case 'auth/email-not-verified':
        return 'Please verify your email address before signing in.';
      default:
        return error.message || 'An error occurred during login.';
    }
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
