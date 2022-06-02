import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesReportComponent } from './badges-report.component';

describe('BadgesReportComponent', () => {
  let component: BadgesReportComponent;
  let fixture: ComponentFixture<BadgesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
