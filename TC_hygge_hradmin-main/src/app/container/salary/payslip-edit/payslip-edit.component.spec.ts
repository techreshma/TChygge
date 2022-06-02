import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipEditComponent } from './payslip-edit.component';

describe('PayslipEditComponent', () => {
  let component: PayslipEditComponent;
  let fixture: ComponentFixture<PayslipEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
