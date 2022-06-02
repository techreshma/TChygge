const badgesFilterObj:any = {
  title:'badges',
  data:[
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
      childFilter: [],
      show: false,
    },
    // {
    //   filtername: 'Martitial Status',
    //   value: 'martitial_status',
    //   childFilter: [
    //     {
    //       title: 'Married',
    //       value: 'married',
    //     },
    //     {
    //       title: 'Unmarried',
    //       value: 'unmarried',
    //     },
    //   ],
    // },
  ],
  
  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'designation',
    'badges_earned',
    'maritial_status',
  ],

  isReset: false
}
export {badgesFilterObj}

/*
    displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting' },
    { title: 'Badges Earned', chk: true, value: 'badges_earned' }, //
    { title: 'Maritial Status', chk: true, value: 'maritial_status' }
  ];
*/
