import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCreateComponent } from './reward-create.component';

describe('RewardCreateComponent', () => {
  let component: RewardCreateComponent;
  let fixture: ComponentFixture<RewardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
