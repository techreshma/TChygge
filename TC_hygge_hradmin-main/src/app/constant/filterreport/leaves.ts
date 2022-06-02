const leavesFilterObj:any  = {
  title:'leaves',
  data : [
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
      value: 'reporting_manager',
      childFilter: [],
      show: false,
    },
    {
      filtername: 'Designation',
      value: 'designation',
      childFilter: [],
      show: false,
    },
    {
      filtername: 'Martitial Status',
      value: 'martitial_status',
      childFilter: [
        {
          title: 'Married',
          value: 'married',
        },
        {
          title: 'Lastname',
          value: 'unmarried',
        },
      ],
      show: false,
    },
  ],

  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'designation',
    'dob',
    'gender',
    'email',
    'mobile',
  ],

  isReset: false
}

export {leavesFilterObj}
