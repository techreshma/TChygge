import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaSurveyComponent } from './sa-survey.component';

describe('SaSurveyComponent', () => {
  let component: SaSurveyComponent;
  let fixture: ComponentFixture<SaSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
