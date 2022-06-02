import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaRewardschallengesChallengesComponent } from './sa-rewardschallenges-challenges.component';

describe('SaRewardschallengesChallengesComponent', () => {
  let component: SaRewardschallengesChallengesComponent;
  let fixture: ComponentFixture<SaRewardschallengesChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaRewardschallengesChallengesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaRewardschallengesChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
