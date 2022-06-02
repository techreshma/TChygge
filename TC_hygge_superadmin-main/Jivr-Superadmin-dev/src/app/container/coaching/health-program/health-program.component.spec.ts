import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthProgramComponent } from './health-program.component';

describe('HealthProgramComponent', () => {
  let component: HealthProgramComponent;
  let fixture: ComponentFixture<HealthProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
