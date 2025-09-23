import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Customer, CustomerUpdateRequest, AvatarUploadResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = '/api/customers';

  // Mock data for development/testing
  private mockCustomer: Customer = {
    id: '123',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phoneNumber: '+1 (555) 123-4567',
    address: {
      street: '123 Laundry Lane',
      city: 'Clean City',
      zipCode: '12345',
      state: 'NY',
      country: 'USA'
    },
    profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  };

  constructor(private http: HttpClient) {}

  /**
   * Get customer profile by ID
   * @param customerId - The customer ID
   * @returns Observable<Customer>
   */
  getCustomer(customerId: string): Observable<Customer> {
    // For development - return mock data
    if (this.isDevelopmentMode()) {
      return of(this.mockCustomer).pipe(delay(1000)); // Simulate API delay
    }

    // Production API call
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update customer profile
   * @param customerId - The customer ID
   * @param updateData - Partial customer data to update
   * @returns Observable<Customer>
   */
  updateCustomer(customerId: string, updateData: Partial<Customer>): Observable<Customer> {
    // For development - simulate update with mock data
    if (this.isDevelopmentMode()) {
      const updatedCustomer = { ...this.mockCustomer, ...updateData, updatedAt: new Date() };
      this.mockCustomer = updatedCustomer;
      return of(updatedCustomer).pipe(delay(1500)); // Simulate API delay
    }

    // Production API call - using PATCH for partial updates
    return this.http.patch<Customer>(`${this.apiUrl}/${customerId}`, updateData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Upload customer avatar/profile picture
   * @param customerId - The customer ID
   * @param file - The image file to upload
   * @returns Observable<AvatarUploadResponse>
   */
  uploadAvatar(customerId: string, file: File): Observable<AvatarUploadResponse> {
    // For development - simulate avatar upload
    if (this.isDevelopmentMode()) {
      const mockResponse: AvatarUploadResponse = {
        profilePictureUrl: URL.createObjectURL(file), // Create a blob URL for preview
        message: 'Profile picture uploaded successfully'
      };
      
      // Update mock customer data
      this.mockCustomer.profilePictureUrl = mockResponse.profilePictureUrl;
      
      return of(mockResponse).pipe(delay(2000)); // Simulate upload delay
    }

    // Production API call
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<AvatarUploadResponse>(`${this.apiUrl}/${customerId}/upload-avatar`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all customers (for admin use)
   * @returns Observable<Customer[]>
   */
  getAllCustomers(): Observable<Customer[]> {
    if (this.isDevelopmentMode()) {
      return of([this.mockCustomer]).pipe(delay(1000));
    }

    return this.http.get<Customer[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete customer account
   * @param customerId - The customer ID
   * @returns Observable<void>
   */
  deleteCustomer(customerId: string): Observable<void> {
    if (this.isDevelopmentMode()) {
      return of(void 0).pipe(delay(1000));
    }

    return this.http.delete<void>(`${this.apiUrl}/${customerId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Search customers by name or email
   * @param query - Search query string
   * @returns Observable<Customer[]>
   */
  searchCustomers(query: string): Observable<Customer[]> {
    if (this.isDevelopmentMode()) {
      const filtered = query.toLowerCase().includes(this.mockCustomer.fullName.toLowerCase()) ||
                     query.toLowerCase().includes(this.mockCustomer.email.toLowerCase())
                     ? [this.mockCustomer] : [];
      return of(filtered).pipe(delay(800));
    }

    return this.http.get<Customer[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Validate email availability
   * @param email - Email to check
   * @param currentCustomerId - Current customer ID (for updates)
   * @returns Observable<boolean>
   */
  isEmailAvailable(email: string, currentCustomerId?: string): Observable<boolean> {
    if (this.isDevelopmentMode()) {
      // Simulate email check - return true if different from mock customer or is current customer
      const isAvailable = email !== this.mockCustomer.email || currentCustomerId === this.mockCustomer.id;
      return of(isAvailable).pipe(delay(500));
    }

    const params = currentCustomerId ? `?exclude=${currentCustomerId}` : '';
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${encodeURIComponent(email)}${params}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error - The HTTP error response
   * @returns Observable that throws formatted error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Authentication required';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Customer not found';
          break;
        case 409:
          errorMessage = 'Email already in use';
          break;
        case 413:
          errorMessage = 'File too large';
          break;
        case 422:
          errorMessage = 'Validation failed';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }

      // If server provides a specific error message
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('CustomerService Error:', {
      status: error.status,
      message: errorMessage,
      error: error
    });

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Check if we're in development mode
   * @returns boolean
   */
  private isDevelopmentMode(): boolean {
    // You can set this based on your environment configuration
    return !window.location.hostname.includes('production-domain.com');
  }

  /**
   * Get mock customer data (for testing/preview)
   * @returns Customer
   */
  getMockCustomer(): Customer {
    return { ...this.mockCustomer };
  }
}