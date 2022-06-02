import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTemplateDetailComponent } from './pre-template-detail.component';

describe('PreTemplateDetailComponent', () => {
  let component: PreTemplateDetailComponent;
  let fixture: ComponentFixture<PreTemplateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreTemplateDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
