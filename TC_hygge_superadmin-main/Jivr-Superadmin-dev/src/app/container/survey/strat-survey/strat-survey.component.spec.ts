import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StratSurveyComponent } from './strat-survey.component';

describe('StratSurveyComponent', () => {
  let component: StratSurveyComponent;
  let fixture: ComponentFixture<StratSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StratSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StratSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
