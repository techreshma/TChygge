import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyGridComponent } from './survey-grid.component';

describe('SurveyGridComponent', () => {
  let component: SurveyGridComponent;
  let fixture: ComponentFixture<SurveyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
