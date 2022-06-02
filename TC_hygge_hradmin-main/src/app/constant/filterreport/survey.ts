

const surveyFilterObj: any = {
  title: 'survey',
  data: [
    {
      filtername: 'Survey name',
      value: 'surveyName',
      childFilter: [
        {
          title: 'Survey Name',
          value: 'name',
          inputtype: 'text'
        },
      ],
    },
    {
      filtername: 'Status',
      value: 'status',
      childFilter: [
        {
          title: 'Open',
          value: 'open',
        },
        {
          title: 'Closed',
          value: 'closed'
        }
      ],
    },

  ],
  
  reset_filter: [
    'surveyName',
    'start_date',
    'end_date',
    'questions',
    'eligible_participants',
    'submissions_completion',
    'survey_started',
    'status',
  ],

  isReset: false
}

export { surveyFilterObj }


/*
   displayedColumnsTitleDemo: any[] = [
    { title: 'Survey name', chk: true, value: 'name_of_survey' },
    { title: 'Start date', chk: true, value: 'start_date' },//
    { title: 'End date', chk: true, value: 'end_date' },//
    { title: 'Questions', chk: true, value: 'questions' },//
    { title: 'Eligible Participants', chk: true, value: 'eligible_participants' },//
    { title: 'Submissions Completion', chk: true, value: 'submissions_completion' },//
    { title: 'Survey Started', chk: true, value: 'survey_started' },//
    { title: 'Status', chk: true, value: 'status' }//
  ];

*/