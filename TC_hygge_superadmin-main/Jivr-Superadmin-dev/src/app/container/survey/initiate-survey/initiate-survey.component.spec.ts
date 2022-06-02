import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateSurveyComponent } from './initiate-survey.component';

describe('InitiateSurveyComponent', () => {
  let component: InitiateSurveyComponent;
  let fixture: ComponentFixture<InitiateSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
