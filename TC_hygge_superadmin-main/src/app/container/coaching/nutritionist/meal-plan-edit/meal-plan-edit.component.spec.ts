import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanEditComponent } from './meal-plan-edit.component';

describe('MealPlanEditComponent', () => {
  let component: MealPlanEditComponent;
  let fixture: ComponentFixture<MealPlanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPlanEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
