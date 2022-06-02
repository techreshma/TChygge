import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipFourComponent } from './payslip-four.component';

describe('PayslipFourComponent', () => {
  let component: PayslipFourComponent;
  let fixture: ComponentFixture<PayslipFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
