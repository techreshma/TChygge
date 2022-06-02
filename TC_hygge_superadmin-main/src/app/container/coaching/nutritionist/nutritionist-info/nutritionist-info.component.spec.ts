import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionistInfoComponent } from './nutritionist-info.component';

describe('NutritionistInfoComponent', () => {
  let component: NutritionistInfoComponent;
  let fixture: ComponentFixture<NutritionistInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionistInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
