import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveManageComponent } from './employee-leave-manage.component';

describe('EmployeeLeaveManageComponent', () => {
  let component: EmployeeLeaveManageComponent;
  let fixture: ComponentFixture<EmployeeLeaveManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLeaveManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
