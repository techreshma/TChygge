import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceAddComponent } from './insurance-add.component';

describe('InsuranceAddComponent', () => {
  let component: InsuranceAddComponent;
  let fixture: ComponentFixture<InsuranceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
