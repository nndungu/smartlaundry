import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Droplet, Eye, EyeOff, Shield, Users, Store } from 'lucide-angular';

import { UserRole } from '../../../core/constants/user-roles';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '../../../core/constants/validation-patterns';
import { APP_CONSTANTS } from '../../../core/constants/app-constants';
import { RegisterRequest } from '../../../models/auth/register-request.model';
import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  readonly Droplet = Droplet;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Shield = Shield;
  readonly Users = Users;
  readonly Store = Store;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      role: ['', [Validators.required]],
      adminPasscode: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(VALIDATION_PATTERNS.PHONE)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { 
      validators: [this.passwordMatchValidator, this.adminPasscodeValidator]
    });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const adminPasscodeControl = this.registerForm.get('adminPasscode');
      
      if (role === UserRole.ADMIN) {
        adminPasscodeControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        adminPasscodeControl?.clearValidators();
        adminPasscodeControl?.setValue('');
      }
      adminPasscodeControl?.updateValueAndValidity();
    });
  }

  private passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  private adminPasscodeValidator(control: AbstractControl): {[key: string]: any} | null {
    const role = control.get('role');
    const adminPasscode = control.get('adminPasscode');
    
    if (!role || role.value !== UserRole.ADMIN) {
      return null;
    }
    
    if (!adminPasscode || !adminPasscode.value) {
      return { adminPasscodeRequired: true };
    }
    
    return adminPasscode.value === APP_CONSTANTS.ADMIN_PASSCODE ? null : { invalidAdminPasscode: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get isFormValid(): boolean {
    const form = this.registerForm;
    const role = form.get('role')?.value;
    const agreeToTerms = form.get('agreeToTerms')?.value;
    const adminPasscode = form.get('adminPasscode')?.value;

    const basicValid = agreeToTerms && role;
    const adminValid = role !== UserRole.ADMIN || (role === UserRole.ADMIN && adminPasscode);
    
    return basicValid && adminValid && form.valid;
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const registerData: RegisterRequest = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Registration successful! Welcome to WashWise.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        alert(errorMessage);
      }
    });
  }

  onGoogleSignUp(): void {
    alert('Google OAuth integration would be implemented here');
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    
    if (field?.hasError('pattern')) {
      return `Please enter a valid ${fieldName}`;
    }
    
    if (fieldName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    if (fieldName === 'adminPasscode' && this.registerForm.hasError('invalidAdminPasscode')) {
      return 'Invalid administrator passcode';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: {[key: string]: string} = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      role: 'Role',
      adminPasscode: 'Admin passcode'
    };
    
    return labels[fieldName] || fieldName;
  }
}