import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { Customer, CustomerUpdateRequest, AvatarUploadResponse } from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  const mockCustomer: Customer = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock window.location for development mode tests
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost'
      },
      writable: true
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomer', () => {
    it('should return mock customer in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.getCustomer('123').subscribe(customer => {
        expect(customer).toBeDefined();
        expect(customer.id).toBe('123');
        expect(customer.fullName).toBe('John Smith');
        expect(customer.email).toBe('john.smith@email.com');
        done();
      });
    });

    it('should make HTTP request in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.getCustomer('123').subscribe(customer => {
        expect(customer).toEqual(mockCustomer);
      });

      const req = httpMock.expectOne('/api/customers/123');
      expect(req.request.method).toBe('GET');
      req.flush(mockCustomer);
    });

    it('should handle error when getting customer', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.getCustomer('123').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toBe('Customer not found');
        }
      });

      const req = httpMock.expectOne('/api/customers/123');
      req.flush('Customer not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateCustomer', () => {
    const updateData: Partial<Customer> = {
      fullName: 'Jane Smith',
      email: 'jane.smith@email.com'
    };

    it('should return updated mock customer in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.updateCustomer('123', updateData).subscribe(customer => {
        expect(customer.fullName).toBe('Jane Smith');
        expect(customer.email).toBe('jane.smith@email.com');
        expect(customer.updatedAt).toBeDefined();
        done();
      });
    });

    it('should make PATCH request in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);
      const updatedCustomer = { ...mockCustomer, ...updateData };

      service.updateCustomer('123', updateData).subscribe(customer => {
        expect(customer).toEqual(updatedCustomer);
      });

      const req = httpMock.expectOne('/api/customers/123');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedCustomer);
    });

    it('should handle validation error when updating customer', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.updateCustomer('123', updateData).subscribe({
        next: () => fail('should have failed with validation error'),
        error: (error) => {
          expect(error.message).toBe('Validation failed');
        }
      });

      const req = httpMock.expectOne('/api/customers/123');
      req.flush('Validation failed', { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  describe('uploadAvatar', () => {
    let mockFile: File;

    beforeEach(() => {
      mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' });
    });

    it('should return mock response in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);
      spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');

      service.uploadAvatar('123', mockFile).subscribe(response => {
        expect(response.profilePictureUrl).toBe('blob:mock-url');
        expect(response.message).toBe('Profile picture uploaded successfully');
        done();
      });
    });

    it('should make POST request with FormData in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);
      const mockResponse: AvatarUploadResponse = {
        profilePictureUrl: 'https://example.com/avatar.jpg',
        message: 'Avatar uploaded successfully'
      };

      service.uploadAvatar('123', mockFile).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/customers/123/upload-avatar');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });

    it('should handle file too large error', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.uploadAvatar('123', mockFile).subscribe({
        next: () => fail('should have failed with file too large error'),
        error: (error) => {
          expect(error.message).toBe('File too large');
        }
      });

      const req = httpMock.expectOne('/api/customers/123/upload-avatar');
      req.flush('File too large', { status: 413, statusText: 'Payload Too Large' });
    });
  });

  describe('getAllCustomers', () => {
    it('should return array with mock customer in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.getAllCustomers().subscribe(customers => {
        expect(customers).toEqual([jasmine.objectContaining({ id: '123' })]);
        expect(customers.length).toBe(1);
        done();
      });
    });

    it('should make GET request for all customers in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);
      const mockCustomers = [mockCustomer];

      service.getAllCustomers().subscribe(customers => {
        expect(customers).toEqual(mockCustomers);
      });

      const req = httpMock.expectOne('/api/customers');
      expect(req.request.method).toBe('GET');
      req.flush(mockCustomers);
    });
  });

  describe('deleteCustomer', () => {
    it('should return void in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.deleteCustomer('123').subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should make DELETE request in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.deleteCustomer('123').subscribe();

      const req = httpMock.expectOne('/api/customers/123');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle forbidden error when deleting customer', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.deleteCustomer('123').subscribe({
        next: () => fail('should have failed with forbidden error'),
        error: (error) => {
          expect(error.message).toBe('Access forbidden');
        }
      });

      const req = httpMock.expectOne('/api/customers/123');
      req.flush('Access forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('searchCustomers', () => {
    it('should return filtered results in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      // Search for existing customer
      service.searchCustomers('john').subscribe(customers => {
        expect(customers.length).toBe(1);
        expect(customers[0].fullName).toContain('John');
        done();
      });
    });

    it('should return empty array for non-matching search in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.searchCustomers('nonexistent').subscribe(customers => {
        expect(customers.length).toBe(0);
        done();
      });
    });

    it('should make GET request with query parameter in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);
      const searchResults = [mockCustomer];

      service.searchCustomers('john smith').subscribe(customers => {
        expect(customers).toEqual(searchResults);
      });

      const req = httpMock.expectOne('/api/customers/search?q=john%20smith');
      expect(req.request.method).toBe('GET');
      req.flush(searchResults);
    });
  });

  describe('isEmailAvailable', () => {
    it('should return true for different email in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.isEmailAvailable('different@email.com').subscribe(isAvailable => {
        expect(isAvailable).toBeTruthy();
        done();
      });
    });

    it('should return false for same email in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.isEmailAvailable('john.smith@email.com').subscribe(isAvailable => {
        expect(isAvailable).toBeFalsy();
        done();
      });
    });

    it('should return true for same email with current customer ID in development mode', (done) => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(true);

      service.isEmailAvailable('john.smith@email.com', '123').subscribe(isAvailable => {
        expect(isAvailable).toBeTruthy();
        done();
      });
    });

    it('should make GET request without exclude parameter in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.isEmailAvailable('test@email.com').subscribe(isAvailable => {
        expect(isAvailable).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/customers/check-email/test%40email.com');
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should make GET request with exclude parameter in production mode', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.isEmailAvailable('test@email.com', '123').subscribe(isAvailable => {
        expect(isAvailable).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/customers/check-email/test%40email.com?exclude=123');
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });

  describe('isDevelopmentMode', () => {
    it('should return true for localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });

      const result = (service as any).isDevelopmentMode();
      expect(result).toBeTruthy();
    });

    it('should return false for production domain', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'production-domain.com' },
        writable: true
      });

      const result = (service as any).isDevelopmentMode();
      expect(result).toBeFalsy();
    });
  });

  describe('getMockCustomer', () => {
    it('should return a copy of mock customer data', () => {
      const mockData = service.getMockCustomer();
      
      expect(mockData).toEqual(jasmine.objectContaining({
        id: '123',
        fullName: 'John Smith',
        email: 'john.smith@email.com'
      }));
      
      // Verify it's a copy, not the original
      mockData.fullName = 'Modified Name';
      const mockData2 = service.getMockCustomer();
      expect(mockData2.fullName).toBe('John Smith');
    });
  });

  describe('handleError', () => {
    it('should handle different HTTP error codes', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      // Test 400 Bad Request
      service.getCustomer('123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.message).toBe('Invalid request data')
      });

      let req = httpMock.expectOne('/api/customers/123');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      // Test 401 Unauthorized
      service.getCustomer('123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.message).toBe('Authentication required')
      });

      req = httpMock.expectOne('/api/customers/123');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      // Test 500 Server Error
      service.getCustomer('123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.message).toBe('Server error - please try again later')
      });

      req = httpMock.expectOne('/api/customers/123');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);
      spyOn(console, 'error');

      service.getCustomer('123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Network error');
          expect(console.error).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne('/api/customers/123');
      req.error(new ErrorEvent('Network error', {
        message: 'Connection failed'
      }));
    });

    it('should use server error message when available', () => {
      spyOn(service as any, 'isDevelopmentMode').and.returnValue(false);

      service.getCustomer('123').subscribe({
        next: () => fail('should have failed'),
        error: (error) => expect(error.message).toBe('Custom server error message')
      });

      const req = httpMock.expectOne('/api/customers/123');
      req.flush(
        { message: 'Custom server error message' }, 
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });
});