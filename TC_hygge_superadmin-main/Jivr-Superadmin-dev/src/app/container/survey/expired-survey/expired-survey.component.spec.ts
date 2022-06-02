import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredSurveyComponent } from './expired-survey.component';

describe('ExpiredSurveyComponent', () => {
  let component: ExpiredSurveyComponent;
  let fixture: ComponentFixture<ExpiredSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
