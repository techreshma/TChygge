const salaryFilterObj: any = {
  title: 'salary',
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
      value: 'reporting',
      childFilter: [],
      show: false,
    },
  ],
  
  reset_filter: [
    'name',
    'department',
    'reporting',
    'basic',
    'allowances',
    'total_salary',
  ],

  isReset: false

}

export { salaryFilterObj }


/*
  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting' },
    { title: 'Basic', chk: true, value: 'basic' },
    { title: 'Allowance', chk: true, value: 'allowances' },
    { title: 'Total Salary', chk: true, value: 'total_salary' }
  ];

*/
