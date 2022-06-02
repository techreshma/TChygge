import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangeViewComponent } from './challange-view.component';

describe('ChallangeViewComponent', () => {
  let component: ChallangeViewComponent;
  let fixture: ComponentFixture<ChallangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallangeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
