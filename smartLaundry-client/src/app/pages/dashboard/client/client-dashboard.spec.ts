import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClientDashboardComponent } from './client-dashboard';

describe('ClientDashboardComponent', () => {
  let component: ClientDashboardComponent;
  let fixture: ComponentFixture<ClientDashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDashboardComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.userName).toBe('Loading...');
    expect(component.fullUserName).toBe('Loading...');
    expect(component.userEmail).toBe('Loading...');
    expect(component.userAvatar).toBe('--');
    expect(component.isLoading).toBe(true);
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should load user data on init', () => {
    component.ngOnInit();
    expect(component.userName).toBe('John');
    expect(component.fullUserName).toBe('John Doe');
    expect(component.userEmail).toBe('john.doe@example.com');
    expect(component.userAvatar).toBe('JD');
  });

  it('should load dashboard data on init', () => {
    component.ngOnInit();
    expect(component.quickStats.totalOrders).toBe(12);
    expect(component.quickStats.activeOrders).toBe(3);
    expect(component.quickStats.monthlySpent).toBe('KES 4500');
    expect(component.orderTableData.length).toBeGreaterThan(0);
  });

  it('should hide loading overlay after timeout', (done) => {
    component.ngOnInit();
    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      done();
    }, 1600);
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen).toBe(false);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should navigate to page and update active state', () => {
    component.navigateToPage('book-service');
    expect(component.navItems.find(item => item.id === 'book-service')?.active).toBe(true);
    expect(component.navItems.find(item => item.id === 'home')?.active).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/client-dashboard/book-service']);
  });

  it('should close mobile menu on navigation', () => {
    component.isMobileMenuOpen = true;
    component.navigateToPage('order-history');
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should handle search input', () => {
    const mockEvent = {
      target: { value: 'test search' }
    } as any;
    spyOn(console, 'log');
    component.handleSearch(mockEvent);
    expect(console.log).toHaveBeenCalledWith('Searching for:', 'test search');
  });

  it('should open notifications', () => {
    component.openNotifications();
    expect(router.navigate).toHaveBeenCalledWith(['/client-dashboard/notifications']);
  });

  it('should open profile', () => {
    component.openProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/client-dashboard/profile-update']);
  });

  it('should open support', () => {
    spyOn(console, 'log');
    component.openSupport();
    expect(console.log).toHaveBeenCalledWith('Opening support...');
  });

  it('should view order details', () => {
    spyOn(component as any, 'showOrderModal');
    component.viewOrderDetails('#1234');
    expect((component as any).showOrderModal).toHaveBeenCalled();
  });

  it('should close modal', () => {
    // Mock modal elements
    const mockModal = document.createElement('div');
    mockModal.id = 'orderModal';
    mockModal.style.display = 'flex';
    document.body.appendChild(mockModal);

    component.closeModal();
    expect(mockModal.style.display).toBe('none');

    document.body.removeChild(mockModal);
  });

  it('should update order progress correctly', () => {
    // Test different statuses
    (component as any).updateOrderProgress('PLACED');
    expect(component.currentOrderProgress.placed.completed).toBe(true);
    expect(component.currentOrderProgress.pickup.completed).toBe(false);

    (component as any).updateOrderProgress('CLEANING');
    expect(component.currentOrderProgress.placed.completed).toBe(true);
    expect(component.currentOrderProgress.pickup.completed).toBe(true);
    expect(component.currentOrderProgress.cleaning.active).toBe(true);
  });

  it('should get initials correctly', () => {
    expect((component as any).getInitials('John Doe')).toBe('JD');
    expect((component as any).getInitials('Alice')).toBe('A');
    expect((component as any).getInitials('')).toBe('U');
  });

  it('should format service name correctly', () => {
    expect((component as any).formatServiceName('wash-fold')).toBe('Wash Fold');
    expect((component as any).formatServiceName('dry-cleaning')).toBe('Dry Cleaning');
  });

  it('should format date correctly', () => {
    const date = (component as any).formatDate('2024-01-15');
    expect(date).toContain('Jan');
    expect(date).toContain('15');
  });

  it('should get status label correctly', () => {
    expect((component as any).getStatusLabel('PLACED')).toBe('Order Placed');
    expect((component as any).getStatusLabel('CLEANING')).toBe('In Progress');
    expect((component as any).getStatusLabel('COMPLETED')).toBe('Completed');
  });

  it('should get status class correctly', () => {
    expect((component as any).getStatusClass('PLACED')).toBe('status-placed');
    expect((component as any).getStatusClass('CLEANING')).toBe('status-progress');
    expect((component as any).getStatusClass('COMPLETED')).toBe('status-completed');
  });

  it('should calculate next pickup correctly', () => {
    const nextPickup = (component as any).calculateNextPickup();
    expect(nextPickup).toBeDefined();
  });

  it('should setup auto refresh', () => {
    spyOn(component as any, 'loadDashboardData');
    component.ngOnInit();
    expect((component as any).subscriptions.length).toBeGreaterThan(0);
  });

  it('should cleanup subscriptions on destroy', () => {
    component.ngOnInit();
    const subscriptionCount = (component as any).subscriptions.length;
    component.ngOnDestroy();
    expect((component as any).subscriptions.length).toBe(0);
  });

  it('should render template correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.dashboard-container')).toBeTruthy();
    expect(compiled.querySelector('.sidebar')).toBeTruthy();
    expect(compiled.querySelector('.main-content')).toBeTruthy();
    expect(compiled.querySelector('.welcome-section')).toBeTruthy();
    expect(compiled.querySelector('.stats-container')).toBeTruthy();
  });

  it('should display user data in template', () => {
    component.userName = 'Test User';
    component.userAvatar = 'TU';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const welcomeTitle = compiled.querySelector('.welcome-title');
    expect(welcomeTitle?.textContent).toContain('Test User');
  });

  it('should display quick stats in template', () => {
    component.quickStats = {
      totalOrders: 5,
      activeOrders: 2,
      monthlySpent: 'KES 1000',
      nextPickup: 'Jan 20'
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const statNumbers = compiled.querySelectorAll('.stat-number');
    expect(statNumbers[0]?.textContent?.trim()).toBe('5');
    expect(statNumbers[1]?.textContent?.trim()).toBe('2');
    expect(statNumbers[2]?.textContent?.trim()).toBe('KES 1000');
  });

  it('should display order table data', () => {
    component.orderTableData = [
      {
        id: '#1234',
        service: 'Wash Fold',
        date: 'Jan 15, 2024',
        status: 'Completed',
        total: 'KES 500',
        statusClass: 'status-completed'
      }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableRows = compiled.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(1);
    expect(tableRows[0].textContent).toContain('#1234');
  });

  it('should show loading overlay when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const loadingOverlay = compiled.querySelector('.loading-overlay');
    expect(loadingOverlay).toBeTruthy();
  });

  it('should hide loading overlay when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const loadingOverlay = compiled.querySelector('.loading-overlay');
    expect(loadingOverlay).toBeFalsy();
  });
});
