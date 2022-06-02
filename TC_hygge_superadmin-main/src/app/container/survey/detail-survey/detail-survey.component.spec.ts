import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSurveyComponent } from './detail-survey.component';

describe('DetailSurveyComponent', () => {
  let component: DetailSurveyComponent;
  let fixture: ComponentFixture<DetailSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
