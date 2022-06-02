import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthwellnessComponent } from './healthwellness.component';

describe('HealthwellnessComponent', () => {
  let component: HealthwellnessComponent;
  let fixture: ComponentFixture<HealthwellnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthwellnessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthwellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
