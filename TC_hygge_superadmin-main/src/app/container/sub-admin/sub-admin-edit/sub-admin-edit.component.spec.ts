import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminEditComponent } from './sub-admin-edit.component';

describe('SubAdminEditComponent', () => {
  let component: SubAdminEditComponent;
  let fixture: ComponentFixture<SubAdminEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAdminEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
