import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaRewardschallengesUserComponent } from './sa-rewardschallenges-user.component';

describe('SaRewardschallengesUserComponent', () => {
  let component: SaRewardschallengesUserComponent;
  let fixture: ComponentFixture<SaRewardschallengesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaRewardschallengesUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaRewardschallengesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
