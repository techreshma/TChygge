import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipSixComponent } from './payslip-six.component';

describe('PayslipSixComponent', () => {
  let component: PayslipSixComponent;
  let fixture: ComponentFixture<PayslipSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
