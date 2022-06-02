import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveFilterComponent } from './leave-filter.component';

describe('FilterComponent', () => {
  let component: LeaveFilterComponent;
  let fixture: ComponentFixture<LeaveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
