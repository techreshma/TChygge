import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAddComponent } from './leave-add.component';

describe('LeaveAddComponent', () => {
  let component: LeaveAddComponent;
  let fixture: ComponentFixture<LeaveAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
