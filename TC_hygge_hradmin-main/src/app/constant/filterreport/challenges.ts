const challengesFilterObj: any = {
  title: 'challenges',
  data: [
    {
      filtername: 'Name',
      value: 'name',
      childFilter: [
        {
          title: 'Name',
          value: 'name',
          inputtype: 'text'
        }
      ],
      show: false,
    },
    {
      filtername: 'Department',
      value: 'department',
      childFilter: [],
      show: false,
    },
    {
      filtername: 'Reporting Manager',
      value: 'reporting_Manager',
      childFilter: [
        {
          title: 'Reporting Manager',
          value: 'reporting_Manager'
        }
      ],
      show: false,
    },
  ],
  
  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'challenge_participated',
    'challenge_completed',
    'totalAvailable_challenge',
    'participation_rate',
    'completion_Rate',
    'rewardPoint_earn',
    'reward_redeemed'
  ],

  isReset: false
}

export { challengesFilterObj }


/*
  { title: 'First name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting_Manager' },
    { title: 'Challenges Participated', chk: true, value: 'challenge_participated' },//
    { title: 'Challenges Completed', chk: true, value: 'challenge_completed' }, //
    { title: 'Total Available Challenges', chk: true, value: 'totalAvailable_challenge' }, //
    { title: 'Participation Rate', chk: true, value: 'participation_rate' }, //
    { title: 'Completion Rate', chk: true, value: 'completion_Rate' }, //
    { title: 'Reward Points Earned', chk: true, value: 'rewardPoint_earn' }, //
    { title: 'Reward Redeemed', chk: true, value: 'reward_redeemed' }, //
*/