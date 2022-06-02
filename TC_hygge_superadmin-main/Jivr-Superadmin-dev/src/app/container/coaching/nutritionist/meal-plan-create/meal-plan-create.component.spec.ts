import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPlanCreateComponent } from './meal-plan-create.component';

describe('MealPlanCreateComponent', () => {
  let component: MealPlanCreateComponent;
  let fixture: ComponentFixture<MealPlanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPlanCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPlanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
