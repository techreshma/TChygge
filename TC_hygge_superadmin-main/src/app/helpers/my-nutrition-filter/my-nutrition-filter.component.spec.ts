import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNutritionFilterComponent } from './my-nutrition-filter.component';

describe('MyNutritionFilterComponent', () => {
  let component: MyNutritionFilterComponent;
  let fixture: ComponentFixture<MyNutritionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNutritionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNutritionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
