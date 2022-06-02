import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipFiveComponent } from './payslip-five.component';

describe('PayslipFiveComponent', () => {
  let component: PayslipFiveComponent;
  let fixture: ComponentFixture<PayslipFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
