import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraAddComponent } from './hra-add.component';

describe('HraAddComponent', () => {
  let component: HraAddComponent;
  let fixture: ComponentFixture<HraAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HraAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HraAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
