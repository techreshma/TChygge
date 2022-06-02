import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangeDetailComponent } from './challange-detail.component';

describe('ChallangeDetailComponent', () => {
  let component: ChallangeDetailComponent;
  let fixture: ComponentFixture<ChallangeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallangeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallangeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
