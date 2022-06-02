import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesListComponent } from './badges-list.component';

describe('BadgesListComponent', () => {
  let component: BadgesListComponent;
  let fixture: ComponentFixture<BadgesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
