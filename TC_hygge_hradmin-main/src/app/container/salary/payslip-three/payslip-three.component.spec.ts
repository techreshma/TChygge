import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipThreeComponent } from './payslip-three.component';

describe('PayslipThreeComponent', () => {
  let component: PayslipThreeComponent;
  let fixture: ComponentFixture<PayslipThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
