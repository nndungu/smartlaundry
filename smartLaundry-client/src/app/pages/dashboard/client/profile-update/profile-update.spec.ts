import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileUpdateComponent } from './profile-update';

describe('ProfileUpdateComponent', () => {
  let component: ProfileUpdateComponent;
  let fixture: ComponentFixture<ProfileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileUpdateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in view mode', () => {
    expect(component.isEditing).toBeFalse();
  });

  it('should toggle edit mode when edit button is clicked', () => {
    component.toggleEditMode();
    expect(component.isEditing).toBeTrue();
  });

  it('should initialize form with user data', () => {
    expect(component.profileForm.get('fullName')?.value).toBe('John Doe');
    expect(component.profileForm.get('email')?.value).toBe('johndoe@email.com');
  });

  it('should validate required fields', () => {
    component.isEditing = true;
    component.profileForm.get('fullName')?.setValue('');
    component.saveChanges();
    
    expect(component.getFieldError('fullName')).toBe('fullName is required');
  });

  it('should validate email format', () => {
    component.isEditing = true;
    component.profileForm.get('email')?.setValue('invalid-email');
    component.profileForm.get('email')?.markAsTouched();
    
    expect(component.getFieldError('email')).toBe('Please enter a valid email');
  });

  it('should save changes when form is valid', () => {
    spyOn(window, 'alert');
    component.isEditing = true;
    component.profileForm.patchValue({
      fullName: 'Jane Doe',
      email: 'jane@email.com',
      phone: '+254 700 000 000',
      address: 'Mombasa, Kenya'
    });
    
    component.saveChanges();
    
    expect(component.isEditing).toBeFalse();
    expect(component.userData.fullName).toBe('Jane Doe');
    expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
  });

  it('should reset form when canceling edit', () => {
    component.isEditing = true;
    component.profileForm.get('fullName')?.setValue('Changed Name');
    
    component.toggleEditMode();
    
    expect(component.isEditing).toBeFalse();
    expect(component.profileForm.get('fullName')?.value).toBe('John Doe');
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as any;
    
    component.onFileSelected(event);
    
    expect(component.selectedFile).toBe(file);
  });
});