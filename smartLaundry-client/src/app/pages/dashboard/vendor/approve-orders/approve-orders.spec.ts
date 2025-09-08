import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveOrders } from './approve-orders';

describe('ApproveOrders', () => {
  let component: ApproveOrders;
  let fixture: ComponentFixture<ApproveOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
