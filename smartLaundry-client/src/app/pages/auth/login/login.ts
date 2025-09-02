// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule]  
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
    private route: ActivatedRoute
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

    // Simulate API call
    setTimeout(() => {
      this.performLogin();
    }, 1500);
  }

  private performLogin(): void {
    // Here you would typically call your authentication service
    const loginData = {
      email: this.formData.email.trim().toLowerCase(),
      password: this.formData.password,
      rememberMe: this.rememberMe
    };

    console.log('Login attempt:', { email: loginData.email, rememberMe: loginData.rememberMe });

    // Simulate different login scenarios
    if (this.formData.email === 'demo@laundrymart.com' && this.formData.password === 'demo123') {
      // Success scenario
      this.isLoading = false;
      this.successMessage = 'Login successful! Redirecting to dashboard...';
      
      // Store authentication data (in real app, this would come from the API)
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirect after success message
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      
    } else if (this.formData.email === 'locked@example.com') {
      // Account locked scenario
      this.isLoading = false;
      this.generalError = 'Your account has been temporarily locked due to too many failed login attempts. Please try again later or reset your password.';
      
    } else if (this.formData.email === 'unverified@example.com') {
      // Unverified email scenario
      this.isLoading = false;
      this.generalError = 'Please verify your email address before signing in. Check your inbox for a verification link.';
      
    } else {
      // Failed login scenario
      this.isLoading = false;
      this.generalError = 'Invalid email or password. Please try again.';
      
      // Clear password field on failed login
      this.formData.password = '';
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