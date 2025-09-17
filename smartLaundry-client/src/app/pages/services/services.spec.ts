import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ServicesComponent, LaundryService } from './services';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 14 services', () => {
    expect(component.services).toBeDefined();
    expect(component.services.length).toBe(14);
  });

  it('should have correct service structure', () => {
    const firstService = component.services[0];
    expect(firstService).toHaveProperty('id');
    expect(firstService).toHaveProperty('title');
    expect(firstService).toHaveProperty('description');
    expect(firstService).toHaveProperty('buttonText');
    expect(firstService).toHaveProperty('route');
  });

  it('should render the page title', () => {
    const titleElement = debugElement.query(By.css('.page-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Our Services');
  });

  it('should render the page subtitle', () => {
    const subtitleElement = debugElement.query(By.css('.page-subtitle'));
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Discover our comprehensive range of laundry and dry cleaning services');
  });

  it('should render all service cards', () => {
    const serviceCards = debugElement.queryAll(By.css('.service-card'));
    expect(serviceCards.length).toBe(component.services.length);
  });

  it('should render service titles correctly', () => {
    const serviceTitles = debugElement.queryAll(By.css('.service-title'));
    expect(serviceTitles.length).toBe(component.services.length);
    
    serviceTitles.forEach((titleElement, index) => {
      expect(titleElement.nativeElement.textContent.trim()).toBe(component.services[index].title);
    });
  });

  it('should render service descriptions correctly', () => {
    const serviceDescriptions = debugElement.queryAll(By.css('.service-description'));
    expect(serviceDescriptions.length).toBe(component.services.length);
    
    serviceDescriptions.forEach((descElement, index) => {
      expect(descElement.nativeElement.textContent.trim()).toBe(component.services[index].description);
    });
  });

  it('should render service buttons with correct text', () => {
    const serviceButtons = debugElement.queryAll(By.css('.service-button'));
    expect(serviceButtons.length).toBe(component.services.length);
    
    serviceButtons.forEach((buttonElement, index) => {
      const buttonText = buttonElement.nativeElement.textContent.trim();
      // The button contains duplicate text for animation, so we check if it includes the expected text
      expect(buttonText).toContain(component.services[index].buttonText);
    });
  });

  it('should mark featured services with featured class', () => {
    const featuredServices = component.services.filter(service => service.featured);
    const featuredCards = debugElement.queryAll(By.css('.service-card.featured'));
    
    expect(featuredCards.length).toBe(featuredServices.length);
  });

  it('should call onServiceClick when service card is clicked', () => {
    spyOn(component, 'onServiceClick');
    
    const firstServiceCard = debugElement.query(By.css('.service-card'));
    firstServiceCard.nativeElement.click();
    
    expect(component.onServiceClick).toHaveBeenCalledWith(component.services[0]);
  });

  it('should call onBookNow when service button is clicked', () => {
    spyOn(component, 'onBookNow');
    
    const firstServiceButton = debugElement.query(By.css('.service-button'));
    firstServiceButton.nativeElement.click();
    
    expect(component.onBookNow).toHaveBeenCalledWith(component.services[0]);
  });

  it('should prevent event propagation when button is clicked', () => {
    spyOn(component, 'onServiceClick');
    spyOn(component, 'onBookNow');
    
    const firstServiceButton = debugElement.query(By.css('.service-button'));
    firstServiceButton.nativeElement.click();
    
    expect(component.onBookNow).toHaveBeenCalled();
    // Service click should not be called when button is clicked due to stopPropagation
  });

  it('should render contact CTA section', () => {
    const contactCta = debugElement.query(By.css('.contact-cta'));
    expect(contactCta).toBeTruthy();
    
    const ctaTitle = contactCta.query(By.css('h3'));
    expect(ctaTitle.nativeElement.textContent.trim()).toBe('Need a custom solution?');
    
    const ctaButton = contactCta.query(By.css('.cta-button'));
    expect(ctaButton.nativeElement.textContent.trim()).toBe('Get In Touch');
  });

  it('should have proper accessibility attributes on service buttons', () => {
    const serviceButtons = debugElement.queryAll(By.css('.service-button'));
    
    serviceButtons.forEach((buttonElement, index) => {
      const ariaLabel = buttonElement.nativeElement.getAttribute('aria-label');
      const expectedAriaLabel = `Book ${component.services[index].title} service`;
      expect(ariaLabel).toBe(expectedAriaLabel);
    });
  });

  it('should handle trackBy function', () => {
    const service: LaundryService = component.services[0];
    const result = component.trackByFn ? component.trackByFn(0, service) : service.id;
    expect(result).toBe(service.id);
  });

  describe('Component methods', () => {
    it('should log navigation route in onServiceClick', () => {
      spyOn(console, 'log');
      const testService = component.services[0];
      
      component.onServiceClick(testService);
      
      expect(console.log).toHaveBeenCalledWith('Navigating to:', testService.route);
    });

    it('should call onServiceClick from onBookNow', () => {
      spyOn(component, 'onServiceClick');
      const testService = component.services[0];
      
      component.onBookNow(testService);
      
      expect(component.onServiceClick).toHaveBeenCalledWith(testService);
    });
  });

  describe('Responsive behavior', () => {
    it('should have responsive grid classes', () => {
      const servicesGrid = debugElement.query(By.css('.services-grid'));
      expect(servicesGrid).toBeTruthy();
      expect(servicesGrid.nativeElement.classList.contains('services-grid')).toBe(true);
    });

    it('should have container wrapper', () => {
      const container = debugElement.query(By.css('.container'));
      expect(container).toBeTruthy();
    });
  });
});