
// 'email',
// 'mobile',

const employeeFilterArray: any = {
  title: 'employee',

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
    {
      filtername: 'Age Range',
      value: 'agerange',
      childFilter: [],
      data: [
        {
          title: '18 - 35',
          value: { start: 18, end: 35 },
          range: 1,
        },
        {
          title: '36 - 50',
          value: { start: 36, end: 50 },
          range: 2,
        },
        {
          title: '51 - 65',
          value: { start: 51, end: 65 },
          range: 3,
        },
        {
          title: '65+',
          value: { start: 65 },
          range: 4,
        }
      ],
      type: 'radio',
      show: false,
    },

    {
      filtername: 'Time Filter',
      value: 'timefilter',
      childFilter: [],
      data: [
        {
          title: 'Today',
          value: {filtertype:1},
          range: 1,
        },
        {
          title: 'Yesterday',
          value: {filtertype:2},
          range: 2,
        },
        {
          title: 'Last 7 days',
          value: {filtertype:3},
          range: 3,
        },
        {
          title: 'Last 30 days',
          value: {filtertype:4},
          range: 4,
        },
        {
          title: 'Last \t Month',
          value: {filtertype:5},
          range: 5,
        },
        {
          title: 'This Month',
          value: {filtertype:6},
          range: 6,
        },
        {
          title: 'This Year',
          value: {filtertype:7},
          range: 7,
        },
      ],
      type: 'timefilter',
      show: false,
    },
    // {
    //   filtername: 'Designation',
    //   value: 'designation',
    //   childFilter: [],
    //   show: false,
    // },
    // {
    //   filtername: 'Gender',
    //   value: 'gender',
    //   childFilter: [
    //     {
    //       title: 'Male',
    //       value: 'male',
    //     },
    //     {
    //       title: 'Female',
    //       value: 'female',
    //     },
    //   ],
    //   show: false,
    // },
    // {
    //   filtername: 'Email',
    //   value: 'email',
    //   childFilter: [
    //     {
    //       title: 'Email',
    //       value: 'email',
    //       inputtype: 'email'
    //     }
    //   ],
    //   show: false,
    // },
    // {
    //   filtername: 'Phone',
    //   value: 'mobile',
    //   childFilter: [
    //     {
    //       title: 'Phone',
    //       value: 'mobile',
    //       inputtype: 'text'
    //     }
    //   ],
    //   show: false,
    // },
  ],

  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'designation',
    'agerange',
    'timefilter',
    'gender',
    'email',
    'mobile',
  ],

  isReset: false
}

export { employeeFilterArray }