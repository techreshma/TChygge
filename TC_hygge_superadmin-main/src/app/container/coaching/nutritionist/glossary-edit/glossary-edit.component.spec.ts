import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryEditComponent } from './glossary-edit.component';

describe('GlossaryEditComponent', () => {
  let component: GlossaryEditComponent;
  let fixture: ComponentFixture<GlossaryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
