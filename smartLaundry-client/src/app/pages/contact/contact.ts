import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  contactInfo = [
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      primary: '(555) 123-4567',
      secondary: 'Available 24/7 for customer support',
      tertiary: 'Emergency pickup requests accepted'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      primary: 'support@laundrysmart.com',
      secondary: 'We\'ll respond within 24 hours',
      tertiary: 'Include your order number for faster service'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Address',
      primary: '123 Main Street',
      secondary: 'Downtown District',
      tertiary: 'City, State 12345'
    },
    {
      icon: 'fas fa-clock',
      title: 'Business Hours',
      primary: 'Monday - Friday: 7:00 AM - 9:00 PM',
      secondary: 'Saturday - Sunday: 8:00 AM - 8:00 PM',
      tertiary: 'Pickup Available 24/7'
    }
  ];

  serviceAreas = [
    'Downtown', 'Midtown', 'University District', 'Business District',
    'Residential Zone', 'Suburbs', 'Harbor District', 'Tech District',
    'Arts Quarter', 'Financial District'
  ];

  faqs = [
    {
      question: 'How do I schedule a pickup?',
      answer: 'You can schedule a pickup through our website, mobile app, or by calling us at (555) 123-4567. We offer flexible time slots from 7 AM to 9 PM, with emergency 24/7 service available.'
    },
    {
      question: 'What is your turnaround time?',
      answer: 'Our standard turnaround is 24 hours for wash & fold services and 48 hours for dry cleaning. Express service is available for $5 extra with 4-hour turnaround.'
    },
    {
      question: 'Do you provide pickup and delivery?',
      answer: 'Yes! Free pickup and delivery is included within city limits. We serve all major districts including Downtown, Midtown, University District, and surrounding areas.'
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We offer a 100% satisfaction guarantee. If you\'re not happy with our service, we\'ll rewash your items for free or provide a full refund.'
    },
    {
      question: 'Are my clothes insured?',
      answer: 'Yes, all items are covered by our comprehensive insurance policy. We take full responsibility for your garments while in our care.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery. Payment is processed securely through our platform.'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setupAnimations();
    this.setupFormValidation();
  }

  private setupAnimations(): void {
    setTimeout(() => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  private setupFormValidation(): void {
    // Phone number formatting
    this.contactForm.get('phone')?.valueChanges.subscribe(value => {
      if (value) {
        const cleaned = value.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 6) {
          formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length >= 3) {
          formatted = cleaned.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        if (formatted !== value) {
          this.contactForm.get('phone')?.setValue(formatted, { emitEvent: false });
        }
      }
    });

    // Form field validation styling
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      if (control) {
        control.valueChanges.subscribe(() => {
          this.updateFieldValidation(key);
        });
      }
    });
  }

  private updateFieldValidation(fieldName: string): void {
    setTimeout(() => {
      const field = document.querySelector(`[formControlName="${fieldName}"]`) as HTMLElement;
      const control = this.contactForm.get(fieldName);
      
      if (field && control) {
        if (control.invalid && control.touched) {
          field.style.borderColor = '#ef4444';
        } else if (control.valid && control.value) {
          field.style.borderColor = 'hsl(var(--primary))';
        } else {
          field.style.borderColor = 'hsl(var(--border))';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
          this.updateFieldValidation(key);
        }
      });
    }
  }

  onEmergencyCall(): void {
    window.location.href = 'tel:+15551234567';
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
      if (field && field.errors) {
        if (field.errors['required']) {
          return fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' is required';
        }
        if (field.errors['email']) {
          return 'Please enter a valid email address';
        }
      }
      return '';
    }
}
