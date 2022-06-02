const attendanceFilterObj: any = {
  title: 'attendance',
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
      childFilter: [],
      show: false,
    },
  ],
  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'days_late',
    'days_on_leave',
    'hours_worked',
    'total_work',
    'excess_deficient',
  ],
  isReset: false
}
export { attendanceFilterObj }


//Enums

// { title: 'Name', chk: true, value: 'name' },
// { title: 'Department', chk: true, value: 'department' },
// { title: 'Reporting manager', chk: true, value: 'reporting_Manager' },
// { title: 'Days Late', chk: true, value: 'days_late' },
// { title: 'Days on leave', chk: true, value: 'days_on_leave' },
// { title: 'Hours Worked', chk: true, value: 'hours_worked' },
// { title: 'Total Work', chk: true, value: 'total_work' },
// { title: 'Excess/Deficient', chk: true, value: 'excess_deficient' },