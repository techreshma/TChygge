import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaUsersComponent } from './sa-users.component';

describe('SaUsersComponent', () => {
  let component: SaUsersComponent;
  let fixture: ComponentFixture<SaUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
