import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaCompaniesComponent } from './sa-companies.component';

describe('SaCompaniesComponent', () => {
  let component: SaCompaniesComponent;
  let fixture: ComponentFixture<SaCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
