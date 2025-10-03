import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileUpdateComponent } from './profile-update.component';
import { By } from '@angular/platform-browser';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileUpdateComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.profileForm).toBeDefined();
    expect(component.location?.value).toBe('');
    expect(component.streetNumber?.value).toBe('');
  });

  it('should load user profile on initialization', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    
    expect(component.userProfile).toBeTruthy();
    expect(component.location?.value).toBe('Nairobi');
    expect(component.streetNumber?.value).toBe('123');
  }));

  it('should validate required fields', () => {
    component.location?.setValue('');
    component.streetNumber?.setValue('');
    
    expect(component.location?.valid).toBeFalsy();
    expect(component.streetNumber?.valid).toBeFalsy();
    expect(component.profileForm.valid).toBeFalsy();
  });

  it('should validate location minimum length', () => {
    component.location?.setValue('A');
    expect(component.location?.valid).toBeFalsy();
    
    component.location?.setValue('Nairobi');
    expect(component.location?.valid).toBeTruthy();
  });

  it('should enable submit button when form is valid and dirty', () => {
    component.profileForm.patchValue({
      location: 'Mombasa',
      streetNumber: '456'
    });
    component.profileForm.markAsDirty();
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should disable submit button when form is invalid', () => {
    component.profileForm.patchValue({
      location: '',
      streetNumber: ''
    });
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should show error messages for required fields when touched', () => {
    component.location?.setValue('');
    component.location?.markAsTouched();
    component.streetNumber?.setValue('');
    component.streetNumber?.markAsTouched();
    fixture.detectChanges();
    
    const errorMessages = fixture.debugElement.queryAll(By.css('.text-red-600'));
    expect(errorMessages.length).toBe(2);
  });

  it('should handle form submission successfully', fakeAsync(() => {
    component.profileForm.patchValue({
      location: 'Kisumu',
      streetNumber: '789',
      houseNumber: '12',
      apartment: 'Lake View Apartments'
    });
    
    component.onSubmit();
    expect(component.isLoading).toBeTruthy();
    
    tick(1500);
    
    expect(component.isLoading).toBeFalsy();
    expect(component.userProfile?.location).toBe('Kisumu');
    expect(component.userProfile?.streetNumber).toBe('789');
    expect(component.successMessage).toBe('Profile updated successfully!');
  }));

  it('should handle form submission failure', fakeAsync(() => {
    // Mock Math.random to always return a value that triggers failure
    spyOn(Math, 'random').and.returnValue(0.1);
    
    component.profileForm.patchValue({
      location: 'Kisumu',
      streetNumber: '789'
    });
    
    component.onSubmit();
    tick(1500);
    
    expect(component.isLoading).toBeFalsy();
    expect(component.errorMessage).toBe('Failed to update profile. Please try again.');
  }));

  it('should reset form on cancel', () => {
    const initialLocation = 'Nairobi';
    const initialStreetNumber = '123';
    
    component.profileForm.patchValue({
      location: 'Modified',
      streetNumber: 'Modified'
    });
    
    component.onCancel();
    
    expect(component.location?.value).toBe(initialLocation);
    expect(component.streetNumber?.value).toBe(initialStreetNumber);
    expect(component.profileForm.pristine).toBeTruthy();
  });

  it('should clear messages on cancel', () => {
    component.successMessage = 'Test message';
    component.errorMessage = 'Error message';
    
    component.onCancel();
    
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    component.profileForm.patchValue({
      location: '',
      streetNumber: ''
    });
    
    component.onSubmit();
    
    expect(component.location?.touched).toBeTruthy();
    expect(component.streetNumber?.touched).toBeTruthy();
  });

  it('should display current address preview when user profile is loaded', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    fixture.detectChanges();
    
    const addressPreview = fixture.debugElement.query(By.css('.bg-blue-50'));
    expect(addressPreview).toBeTruthy();
    expect(addressPreview.nativeElement.textContent).toContain('Nairobi');
    expect(addressPreview.nativeElement.textContent).toContain('123');
  }));

  it('should check for unsaved changes correctly', () => {
    expect(component.hasUnsavedChanges()).toBeFalsy();
    
    component.profileForm.patchValue({
      location: 'Modified'
    });
    component.profileForm.markAsDirty();
    
    expect(component.hasUnsavedChanges()).toBeTruthy();
  });
});