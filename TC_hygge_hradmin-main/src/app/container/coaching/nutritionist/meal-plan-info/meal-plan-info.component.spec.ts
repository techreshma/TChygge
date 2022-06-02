import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanInfoComponent } from './meal-plan-info.component';

describe('MealPlanInfoComponent', () => {
  let component: MealPlanInfoComponent;
  let fixture: ComponentFixture<MealPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPlanInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
