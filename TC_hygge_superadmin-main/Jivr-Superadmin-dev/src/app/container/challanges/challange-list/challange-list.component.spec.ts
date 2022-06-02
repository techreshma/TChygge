import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangeListComponent } from './challange-list.component';

describe('ChallangeListComponent', () => {
  let component: ChallangeListComponent;
  let fixture: ComponentFixture<ChallangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallangeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
