import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ProfileUpdateComponent } from './profile-update.component';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;

  const mockCustomer: Customer = {
    id: '123',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001'
    },
    profilePictureUrl: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', [
      'getCustomer',
      'updateCustomer',
      'uploadAvatar'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProfileUpdateComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
    mockCustomerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('fullName')?.hasError('required')).toBeTruthy();
    expect(component.profileForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.profileForm.get('phoneNumber')?.hasError('required')).toBeTruthy();
    expect(component.profileForm.get('address.street')?.hasError('required')).toBeTruthy();
  });

  it('should load customer profile on init', () => {
    mockCustomerService.getCustomer.and.returnValue(of(mockCustomer));
    
    component.ngOnInit();

    expect(mockCustomerService.getCustomer).toHaveBeenCalledWith('123');
    expect(component.customer).toEqual(mockCustomer);
    expect(component.originalData).toEqual(mockCustomer);
    expect(component.profileForm.get('fullName')?.value).toBe('John Doe');
  });

  it('should handle error when loading customer profile', () => {
    spyOn(component as any, 'showErrorMessage');
    mockCustomerService.getCustomer.and.returnValue(throwError(() => new Error('API Error')));
    
    component.ngOnInit();

    expect(component.isLoading).toBeFalsy();
    expect((component as any).showErrorMessage).toHaveBeenCalledWith('Failed to load profile data');
  });

  it('should validate form fields correctly', () => {
    // Test full name validation
    const fullNameControl = component.profileForm.get('fullName');
    fullNameControl?.setValue('');
    fullNameControl?.markAsTouched();
    expect(component.getFieldError('fullName')).toBe('fullName is required');

    fullNameControl?.setValue('J');
    expect(component.getFieldError('fullName')).toBe('fullName is too short');

    // Test email validation
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    expect(component.getFieldError('email')).toBe('Please enter a valid email');

    // Test phone validation
    const phoneControl = component.profileForm.get('phoneNumber');
    phoneControl?.setValue('123');
    phoneControl?.markAsTouched();
    expect(component.getFieldError('phoneNumber')).toBe('Please enter a valid phoneNumber');
  });

  it('should validate address fields correctly', () => {
    const zipControl = component.profileForm.get('address.zipCode');
    zipControl?.setValue('invalid');
    zipControl?.markAsTouched();
    expect(component.getAddressFieldError('zipCode')).toBe('Please enter a valid zipCode');

    zipControl?.setValue('12345');
    expect(component.getAddressFieldError('zipCode')).toBe('');
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(FileReader.prototype, 'readAsDataURL');
    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toBe(mockFile);
  });

  it('should reject large files', () => {
    const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB
    
    const mockEvent = { target: { files: [largeFile] } };
    spyOn(component as any, 'showErrorMessage');

    component.onFileSelected(mockEvent);

    expect((component as any).showErrorMessage).toHaveBeenCalledWith('File size must be less than 5MB');
    expect(component.selectedFile).toBeNull();
  });

  it('should reject non-image files', () => {
    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [textFile] } };
    spyOn(component as any, 'showErrorMessage');

    component.onFileSelected(mockEvent);

    expect((component as any).showErrorMessage).toHaveBeenCalledWith('Please select a valid image file');
  });

  it('should upload profile picture', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.selectedFile = mockFile;
    
    const mockResponse = { profilePictureUrl: 'https://example.com/new-avatar.jpg' };
    mockCustomerService.uploadAvatar.and.returnValue(of(mockResponse));
    spyOn(component as any, 'showSuccessMessage');

    component.uploadProfilePicture();

    expect(mockCustomerService.uploadAvatar).toHaveBeenCalledWith('123', mockFile);
    expect(component.avatarPreview).toBe('https://example.com/new-avatar.jpg');
    expect((component as any).showSuccessMessage).toHaveBeenCalledWith('Profile picture updated successfully');
    expect(component.selectedFile).toBeNull();
  });

  it('should handle avatar upload error', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    component.selectedFile = mockFile;
    
    mockCustomerService.uploadAvatar.and.returnValue(throwError(() => new Error('Upload failed')));
    spyOn(component as any, 'showErrorMessage');

    component.uploadProfilePicture();

    expect((component as any).showErrorMessage).toHaveBeenCalledWith('Failed to upload profile picture');
    expect(component.isUploading).toBeFalsy();
  });

  it('should save profile changes', () => {
    // Setup form with valid data
    component.profileForm.patchValue({
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phoneNumber: '+1987654321',
      address: {
        street: '456 Oak St',
        city: 'Boston',
        zipCode: '02101'
      }
    });

    const updatedCustomer = { ...mockCustomer, fullName: 'Jane Doe' };
    mockCustomerService.updateCustomer.and.returnValue(of(updatedCustomer));
    spyOn(component as any, 'showSuccessMessage');

    component.onSave();

    expect(mockCustomerService.updateCustomer).toHaveBeenCalledWith('123', jasmine.any(Object));
    expect(component.customer).toEqual(updatedCustomer);
    expect((component as any).showSuccessMessage).toHaveBeenCalledWith('Profile updated successfully');
  });

  it('should not save if form is invalid', () => {
    component.profileForm.patchValue({
      fullName: '', // Invalid - required field
      email: 'invalid-email',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    });

    spyOn(component as any, 'showErrorMessage');
    spyOn(component as any, 'markFormGroupTouched');

    component.onSave();

    expect(mockCustomerService.updateCustomer).not.toHaveBeenCalled();
    expect((component as any).showErrorMessage).toHaveBeenCalledWith('Please fix the form errors before saving');
    expect((component as any).markFormGroupTouched).toHaveBeenCalled();
  });

  it('should handle save error', () => {
    component.profileForm.patchValue({
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phoneNumber: '+1987654321',
      address: {
        street: '456 Oak St',
        city: 'Boston',
        zipCode: '02101'
      }
    });

    mockCustomerService.updateCustomer.and.returnValue(throwError(() => new Error('Save failed')));
    spyOn(component as any, 'showErrorMessage');

    component.onSave();

    expect((component as any).showErrorMessage).toHaveBeenCalledWith('Failed to update profile');
    expect(component.isSaving).toBeFalsy();
  });

  it('should reset form on cancel', () => {
    component.originalData = mockCustomer;
    component.profileForm.patchValue({
      fullName: 'Changed Name',
      email: 'changed@example.com'
    });

    spyOn(component as any, 'showSuccessMessage');

    component.onCancel();

    expect(component.profileForm.get('fullName')?.value).toBe('John Doe');
    expect(component.profileForm.get('email')?.value).toBe('john.doe@example.com');
    expect((component as any).showSuccessMessage).toHaveBeenCalledWith('Changes have been reset');
  });

  it('should trigger file input', () => {
    const mockFileInput = jasmine.createSpyObj('HTMLInputElement', ['click']);
    spyOn(document, 'getElementById').and.returnValue(mockFileInput);

    component.triggerFileInput();

    expect(document.getElementById).toHaveBeenCalledWith('fileInput');
    expect(mockFileInput.click).toHaveBeenCalled();
  });

  it('should mark form group as touched', () => {
    const formGroup = component.profileForm;
    
    (component as any).markFormGroupTouched(formGroup);

    expect(formGroup.get('fullName')?.touched).toBeTruthy();
    expect(formGroup.get('email')?.touched).toBeTruthy();
    expect(formGroup.get('address.street')?.touched).toBeTruthy();
  });

  it('should return empty string for valid fields', () => {
    component.profileForm.patchValue({
      fullName: 'Valid Name',
      email: 'valid@example.com',
      phoneNumber: '+1234567890'
    });

    expect(component.getFieldError('fullName')).toBe('');
    expect(component.getFieldError('email')).toBe('');
  });

  it('should return empty string for valid address fields', () => {
    component.profileForm.patchValue({
      address: {
        street: '123 Main St',
        city: 'Valid City',
        zipCode: '12345'
      }
    });

    expect(component.getAddressFieldError('street')).toBe('');
    expect(component.getAddressFieldError('city')).toBe('');
    expect(component.getAddressFieldError('zipCode')).toBe('');
  });

  it('should handle missing selectedFile in uploadProfilePicture', () => {
    component.selectedFile = null;

    component.uploadProfilePicture();

    expect(mockCustomerService.uploadAvatar).not.toHaveBeenCalled();
  });

    it('should handle missing originalData in onCancel', () => {
      component.originalData = null;
  
      component.onCancel();
  
      // Should not throw error and not call showSuccessMessage
      expect(component).toBeTruthy();
    });
  });