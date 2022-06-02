const documentsFilterObj: any = {
  title: 'documents',
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
    // {
    //   filtername: 'Marital Status',
    //   value: 'marital_Status',
    //   childFilter: [
    //     {
    //       title: 'Married',
    //       value: 'Married'
    //     },
    //     {
    //       title: 'Unmarried',
    //       value: 'Unmarried'
    //     }
    //   ],
    //   show: false,
    // },
  ],

  reset_filter: [
    'name',
    'department',
    'reporting_Manager',
    'marital_Status',
    'document_uplaod',
    'document_missing',
    'document_expire',
  ],

  isReset: false
}

export { documentsFilterObj }


/*
  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'report' },
    { title: 'Marital Status', chk: true, value: 'marital' },
    { title: 'Document Upload', chk: true, value: 'document_uplaod' }, //
    { title: 'Document Missing', chk: true, value: 'document_missing' }, //
    { title: 'Document Expire', chk: true, value: 'document_expire' }, //
  ];

*/
