import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipTwoComponent } from './payslip-two.component';

describe('PayslipTwoComponent', () => {
  let component: PayslipTwoComponent;
  let fixture: ComponentFixture<PayslipTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
