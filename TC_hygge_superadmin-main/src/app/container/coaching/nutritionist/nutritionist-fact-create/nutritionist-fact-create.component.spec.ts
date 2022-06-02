import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionistFactCreateComponent } from './nutritionist-fact-create.component';

describe('NutritionistFactCreateComponent', () => {
  let component: NutritionistFactCreateComponent;
  let fixture: ComponentFixture<NutritionistFactCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionistFactCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionistFactCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
