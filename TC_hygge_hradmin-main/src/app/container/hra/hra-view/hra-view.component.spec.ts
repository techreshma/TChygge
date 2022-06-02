import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HraViewComponent } from './hra-view.component';

describe('HraViewComponent', () => {
  let component: HraViewComponent;
  let fixture: ComponentFixture<HraViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HraViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
