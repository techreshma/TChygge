import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipGenerateComponent } from './payslip-generate.component';

describe('PayslipGenerateComponent', () => {
  let component: PayslipGenerateComponent;
  let fixture: ComponentFixture<PayslipGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
