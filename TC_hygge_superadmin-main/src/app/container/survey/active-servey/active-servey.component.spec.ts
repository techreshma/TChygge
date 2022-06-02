import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveServeyComponent } from './active-servey.component';

describe('ActiveServeyComponent', () => {
  let component: ActiveServeyComponent;
  let fixture: ComponentFixture<ActiveServeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveServeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveServeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
