import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTemplateComponent } from './pre-template.component';

describe('PreTemplateComponent', () => {
  let component: PreTemplateComponent;
  let fixture: ComponentFixture<PreTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
