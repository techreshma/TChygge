import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCoachComponent } from './my-coach.component';

describe('MyCoachComponent', () => {
  let component: MyCoachComponent;
  let fixture: ComponentFixture<MyCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
