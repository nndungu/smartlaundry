import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileUpdateComponent, DriverProfile } from './profile-update.component';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;
  let httpMock: HttpTestingController;

  const mockProfile: DriverProfile = {
    id: 'driver-123',
    fullName: 'John Driver',
    phoneNumber: '+254712345678',
    email: 'john.driver@smartlaundry.com',
    profilePhoto: 'https://example.com/photo.jpg',
    vehicleType: 'car',
    vehicleRegistration: 'KCD 123A',
    licenseNumber: 'DL123456789',
    address: {
      city: 'Nairobi',
      street: 'Moi Avenue',
      houseNumber: '123'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileUpdateComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('driver-123');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile data on init', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/drivers/driver-123');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);

    tick();

    expect(component.profileForm.value.fullName).toBe('John Driver');
    expect(component.profileForm.value.email).toBe('john.driver@smartlaundry.com');
    expect(component.profileForm.value.vehicleType).toBe('car');
    expect(component.loading).toBeFalse();
  }));

  it('should handle profile loading error', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/drivers/driver-123');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(component.error).toBe('Failed to load profile data. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should validate required fields', () => {
    component.profileForm.patchValue({
      fullName: '',
      email: '',
      vehicleType: ''
    });

    expect(component.profileForm.invalid).toBeTrue();
    expect(component.profileForm.get('fullName')?.errors?.['required']).toBeTruthy();
    expect(component.profileForm.get('email')?.errors?.['required']).toBeTruthy();
    expect(component.profileForm.get('vehicleType')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.profileForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should validate phone number pattern', () => {
    const phoneControl = component.profileForm.get('phoneNumber');
    
    phoneControl?.setValue('abc');
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();

    phoneControl?.setValue('+254712345678');
    expect(phoneControl?.errors).toBeNull();
  });

  it('should update profile successfully', fakeAsync(() => {
    // Load initial data
    component.ngOnInit();
    const loadReq = httpMock.expectOne('/api/drivers/driver-123');
    loadReq.flush(mockProfile);
    tick();

    // Update form values
    component.profileForm.patchValue({
      fullName: 'John Updated',
      phoneNumber: '+254798765432'
    });

    component.onSubmit();

    const updateReq = httpMock.expectOne('/api/drivers/driver-123');
    expect(updateReq.request.method).toBe('PATCH');
    expect(updateReq.request.body.get('fullName')).toBe('John Updated');
    
    const updatedProfile = { ...mockProfile, fullName: 'John Updated' };
    updateReq.flush(updatedProfile);

    tick();

    expect(component.success).toBeTrue();
    expect(component.submitting).toBeFalse();
    expect(component.profileForm.value.fullName).toBe('John Updated');
  }));

  it('should handle profile update error', fakeAsync(() => {
    component.ngOnInit();
    const loadReq = httpMock.expectOne('/api/drivers/driver-123');
    loadReq.flush(mockProfile);
    tick();

    component.onSubmit();

    const updateReq = httpMock.expectOne('/api/drivers/driver-123');
    updateReq.error(new ErrorEvent('Update failed'));

    tick();

    expect(component.error).toBe('Failed to update profile. Please try again.');
    expect(component.submitting).toBeFalse();
    expect(component.success).toBeFalse();
  }));

  it('should not submit invalid form', () => {
    component.profileForm.patchValue({
      fullName: '' // Required field empty
    });

    spyOn(component, 'prepareFormData');
    component.onSubmit();

    expect(component.prepareFormData).not.toHaveBeenCalled();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    spyOn(FileReader.prototype, 'readAsDataURL');
    
    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('should reject invalid file types', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBeNull();
    expect(component.error).toContain('valid image file');
  });

  it('should reject large files', () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [largeFile] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBeNull();
    expect(component.error).toContain('less than 5MB');
  });

  it('should reset form changes', fakeAsync(() => {
    component.ngOnInit();
    const loadReq = httpMock.expectOne('/api/drivers/driver-123');
    loadReq.flush(mockProfile);
    tick();

    // Modify form
    component.profileForm.patchValue({ fullName: 'Modified Name' });
    component.selectedFile = new File([''], 'test.jpg');

    component.onReset();

    // Should reload profile
    const reloadReq = httpMock.expectOne('/api/drivers/driver-123');
    reloadReq.flush(mockProfile);
    tick();

    expect(component.profileForm.value.fullName).toBe('John Driver');
    expect(component.selectedFile).toBeNull();
    expect(component.error).toBe('');
  }));

  it('should prepare form data with file', () => {
    component.profileForm.patchValue({
      fullName: 'Test Driver',
      email: 'test@driver.com',
      address: {
        city: 'Nairobi',
        street: 'Test St',
        houseNumber: '123'
      }
    });

    const testFile = new File([''], 'test.jpg');
    component.selectedFile = testFile;

    const formData = component.prepareFormData();

    expect(formData.get('fullName')).toBe('Test Driver');
    expect(formData.get('profilePhoto')).toBe(testFile);
    expect(formData.get('address')).toBe('{"city":"Nairobi","street":"Test St","houseNumber":"123"}');
  });

  it('should return correct field errors', () => {
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();

    expect(component.getFieldError('email')).toBe('This field is required');

    emailControl?.setValue('invalid');
    expect(component.getFieldError('email')).toBe('Please enter a valid email address');
  });

  it('should check field validity correctly', () => {
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();

    expect(component.isFieldInvalid('email')).toBeTrue();

    emailControl?.set)
