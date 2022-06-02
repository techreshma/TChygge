import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesReportComponent } from './challenges-report.component';

describe('ChallengesReportComponent', () => {
  let component: ChallengesReportComponent;
  let fixture: ComponentFixture<ChallengesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
