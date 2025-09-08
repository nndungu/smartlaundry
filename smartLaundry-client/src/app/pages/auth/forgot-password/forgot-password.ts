import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  expiresInMinutes?: number;
  verificationCode?: string; // Only in development mode
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,        // For *ngIf, *ngFor
    ReactiveFormsModule, // For [formGroup], formControlName
    RouterModule         // For routerLink
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  host: {
    '[class.success]': 'isSuccess',
    '[class.error]': 'globalError'
  }
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  isSuccess = false;
  submittedEmail = '';
  globalError = '';
  resetLinkExpiryMinutes = 30;
  resendCooldown = 0;
  
  private countdownSubscription?: Subscription;
  private readonly API_BASE_URL = 'http://localhost:3000/api'; // Update with your API URL

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(255)
      ]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearGlobalError();
    const email = this.forgotPasswordForm.get('email')?.value.trim().toLowerCase();

    try {
      const response = await this.sendPasswordResetEmail(email);
      
      this.submittedEmail = email;
      this.isSuccess = true;
      
      // Update expiry time from API response
      if (response.expiresInMinutes) {
        this.resetLinkExpiryMinutes = response.expiresInMinutes;
      }

      // Start resend cooldown
      this.startResendCooldown(60); // 60 seconds cooldown
      
      // Reset form
      this.forgotPasswordForm.reset();
      
    } catch (error) {
      console.error('Error sending password reset email:', error);
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async resendEmail(): Promise<void> {
    if (this.resendCooldown > 0 || !this.submittedEmail) {
      return;
    }

    this.isLoading = true;
    this.clearGlobalError();

    try {
      await this.sendPasswordResetEmail(this.submittedEmail);
      this.startResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      console.error('Error resending password reset email:', error);
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async sendPasswordResetEmail(email: string): Promise<ForgotPasswordResponse> {
    const requestPayload: ForgotPasswordRequest = { email };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<ForgotPasswordResponse>(
      `${this.API_BASE_URL}/auth/forgot-password`,
      requestPayload,
      { headers }
    ).toPromise() as Promise<ForgotPasswordResponse>;
  }

  private startResendCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    this.countdownSubscription?.unsubscribe();
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.countdownSubscription?.unsubscribe();
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      this.forgotPasswordForm.get(key)?.markAsTouched();
    });
  }

  private handleError(error: any): void {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error?.status === 404) {
      errorMessage = 'Email address not found in our system.';
    } else if (error?.status === 429) {
      errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
    } else if (error?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    this.globalError = errorMessage;
  }

  clearGlobalError(): void {
    this.globalError = '';
  }

  goBack(): void {
    this.isSuccess = false;
    this.globalError = '';
    this.forgotPasswordForm.reset();
    this.countdownSubscription?.unsubscribe();
    this.resendCooldown = 0;
  }

  // Utility method to validate email format (can be used in template)
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}