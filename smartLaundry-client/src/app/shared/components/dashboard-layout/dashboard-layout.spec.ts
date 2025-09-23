import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DashboardLayoutComponent } from './dashboard-layout';

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url'], {
      events: of(),
      url: '/client-dashboard'
    });

    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isMobileMenuOpen).toBeFalse();
    expect(component.notificationCount).toBe(0);
    expect(component.userName).toBe('User');
    expect(component.navItems.length).toBe(7);
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBeFalse();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTrue();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should navigate to page', () => {
    component.navigateToPage('book-service');
    expect(router.navigate).toHaveBeenCalledWith(['/client-dashboard/book-service']);
  });

  it('should update active nav item', () => {
    component.updateActiveNavItem('/client-dashboard/book-service');
    const bookServiceItem = component.navItems.find(item => item.id === 'book-service');
    expect(bookServiceItem?.active).toBeTrue();
  });

  it('should set loading state', () => {
    expect(component.isLoading).toBeFalse();
    component.setLoading(true);
    expect(component.isLoading).toBeTrue();
    component.setLoading(false);
    expect(component.isLoading).toBeFalse();
  });
});
