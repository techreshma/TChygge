import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingListComponent } from './missing-list.component';

describe('MissingListComponent', () => {
  let component: MissingListComponent;
  let fixture: ComponentFixture<MissingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
