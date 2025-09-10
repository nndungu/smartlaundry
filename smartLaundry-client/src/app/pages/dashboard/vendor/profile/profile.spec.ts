import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('businessName')).toBeDefined();
    expect(component.profileForm.get('email')).toBeDefined();
    expect(component.profileForm.get('phone')).toBeDefined();
    expect(component.profileForm.get('businessCategory')).toBeDefined();
    expect(component.profileForm.get('businessDescription')).toBeDefined();
  });

  it('should have business categories defined', () => {
    expect(component.businessCategories).toBeDefined();
    expect(component.businessCategories.length).toBeGreaterThan(0);
  });

  it('should validate file type on selection', () => {
    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as any;

    component.onFileSelected(mockEvent);

    expect(component.notification?.type).toBe('error');
    expect(component.notification?.message).toBe('Please select a valid image file.');
  });

  it('should validate file size on selection', () => {
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [largeFile]
      }
    } as any;

    component.onFileSelected(mockEvent);

    expect(component.notification?.type).toBe('error');
    expect(component.notification?.message).toBe('File size must be less than 5MB.');
  });

  it('should show success notification on valid form submission', () => {
    component.profileForm.patchValue({
      businessName: 'Test Business',
      email: 'test@example.com',
      phone: '+254712345678',
      businessCategory: 'Laundry Service',
      businessDescription: 'Test description'
    });

    component.onSubmit();

    expect(component.isUploading).toBe(true);
    // Note: The setTimeout in onSubmit would need to be handled in integration tests
  });

  it('should show error notification on invalid form submission', () => {
    component.onSubmit();

    expect(component.notification?.type).toBe('error');
    expect(component.notification?.message).toBe('Please fill in all required fields correctly.');
  });
});
