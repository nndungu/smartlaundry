import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(component.cartItems).toEqual([]);
    expect(component.cartTotal).toBe(0);
  });

  it('should calculate cart total correctly', () => {
    component.cartItems = [
      { id: '1', name: 'Test Item 1', quantity: 2, price: 100, service: 'Wash & Fold' },
      { id: '2', name: 'Test Item 2', quantity: 1, price: 200, service: 'Dry Cleaning' }
    ];
    component.cartTotal = component.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    expect(component.cartTotal).toBe(400);
  });
});
