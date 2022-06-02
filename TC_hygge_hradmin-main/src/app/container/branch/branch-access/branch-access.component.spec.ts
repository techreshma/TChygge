import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAccessComponent } from './branch-access.component';

describe('BranchAccessComponent', () => {
  let component: BranchAccessComponent;
  let fixture: ComponentFixture<BranchAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
