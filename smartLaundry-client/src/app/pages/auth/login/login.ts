import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthResponse } from '../../../models/auth/auth-response.model';
import { UserRole } from '../../../core/constants/user-roles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
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

  emailError = '';
  passwordError = '';
  generalError = '';
  successMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Registration successful! Please sign in.';
      }
      if (params['verified'] === 'true') {
        this.successMessage = 'Email verified! Please sign in.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.clearErrors();

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.login(
      this.formData.email.trim().toLowerCase(),
      this.formData.password
    )
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
        this.successMessage = 'Login successful! Redirecting...';

        // Redirect based on role
        const role = response.user.role;
        setTimeout(() => {
          if (role === UserRole.ADMIN) {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/client-dashboard']);
          }
        }, 1000);
      }
    });
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.formData.email.trim()) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isEmailValid(this.formData.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    if (!this.formData.password.trim()) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.formData.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long';
      isValid = false;
    }

    return isValid;
  }

  private getErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred. Please try again.';
    if (error.status === 401) return 'Invalid email or password. Please try again.';
    if (error.status === 400) return 'Invalid request. Please check your input.';
    if (error.status === 500) return 'Server error. Please try again later.';
    return error.error?.message || error.message || 'An error occurred during login.';
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
}