import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionistFactEditComponent } from './nutritionist-fact-edit.component';

describe('NutritionistFactEditComponent', () => {
  let component: NutritionistFactEditComponent;
  let fixture: ComponentFixture<NutritionistFactEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionistFactEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionistFactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
