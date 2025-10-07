import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard';

describe('VendorDashboardComponent', () => {
  let component: VendorDashboardComponent;
  let fixture: ComponentFixture<VendorDashboardComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUserProfile = {
    id: '123',
    name: 'John Doe',
    email: 'john@smartlaundry.com',
    role: 'Vendor'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: {} as any },
          { path: 'orders', component: {} as any },
          { path: 'profile', component: {} as any },
          { path: 'login', component: {} as any }
        ]),
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/auth/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockUserProfile);

    tick();

    expect(component.userProfile).toEqual(mockUserProfile);
    expect(component.userName).toBe('John Doe');
    expect(component.userRole).toBe('Vendor');
  }));

  it('should handle user profile loading error', fakeAsync(() => {
    component.ngOnInit();

    const req = httpMock.expectOne('/api/auth/profile');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(component.userName).toBe('Vendor User');
    expect(component.userRole).toBe('Vendor');
  }));

  it('should generate correct user initials', () => {
    // Single name
    component.userName = 'John';
    expect(component.getUserInitials()).toBe('J');

    // Two names
    component.userName = 'John Doe';
    expect(component.getUserInitials()).toBe('JD');

    // Three names
    component.userName = 'John Michael Doe';
    expect(component.getUserInitials()).toBe('JD');

    // Empty name
    component.userName = '';
    expect(component.getUserInitials()).toBe('U');

    // Loading state
    component.userName = 'Loading...';
    expect(component.getUserInitials()).toBe('U');
  });

  it('should logout successfully', fakeAsync(() => {
    spyOn(router, 'navigate');
    spyOn(localStorage, 'removeItem');
    spyOn(sessionStorage, 'removeItem');

    component.logout();

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});

    tick();

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle logout error and still redirect', fakeAsync(() => {
    spyOn(router, 'navigate');
    spyOn(console, 'error');

    component.logout();

    const req = httpMock.expectOne('/api/auth/logout');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(console.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should check active route correctly', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/dashboard');
    
    expect(component.isActiveRoute('/dashboard')).toBeTrue();
    expect(component.isActiveRoute('/orders')).toBeFalse();
  });

  it('should navigate to different routes', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.navigateToDashboard();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);

    component.navigateToOrders();
    expect(navigateSpy).toHaveBeenCalledWith(['/orders']);

    component.navigateToProfile();
    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });
});