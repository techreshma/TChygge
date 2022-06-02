import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  ScheduleComponent,

} from '@syncfusion/ej2-angular-schedule';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import 'chart.piecelabel.js';

@Component({
  providers: [DayService, WeekService, WorkWeekService, MonthService],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('scheduleObj', { static: true })
  public scheduleObj: ScheduleComponent;
  public data: any = [];

  public minDate: Date = new Date();
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false,
    dataSource: [],
  };

  attendance_averagehour: any = 0
  displayedColumns: string[] = ['position', 'name', 'designation', 'status'];
  dataSource = ELEMENT_DATA;
  genEmpGraphData: any;
  activeChallanges: number = 0;
  totalParticipant: number = 0;
  heatGraph: any;
  onewtimeArrival: any = 0;
  attendanceMonth: any = 0;

  dashboardLeave: any = 0;
  dashboardDocument: any = 0;
  dashboardMessage: any = 0;
  dashboardActiveSurvey: any = 0


  onleaveToday: any = [];
  celebrateAnniversary: any = [];
  celebrateBirthday: any = [];
  rewardRedeemedGraphData: any;

  licenseRemaining:any  = '';
  numberOfEmployee:any = '';

  challangeGuageData: any
  hraRadarData: any;
  time: any = moment().format('hh:mm:ss A')
  day: any = moment().format('dddd DD, MMMM yyyy')
  constructor(
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getDashboardDetail();
    this.getList();
    this.getChallangesList();
    this.getEvent();
    this.getActivesurvey();
  }

  //Load dashboard
  async getDashboardDetail() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData'))?.company_id,
    };
    await this._api.dashBoardApi(formData)?.subscribe(
      (res) => {
        const response: any = res;
        if (response.success == true) {
          this.dashboardDocument = response.data.open_action.document;
          this.dashboardMessage = response.data.open_action.message;
          this.dashboardLeave = response.data.open_action.leave;

          if (response.data.redeem_reward) {
            response.data.redeem_reward.map((item) => { item.month })
            response.data.redeem_reward.map((item) => { item.redeemCount })
          }

          this.hraRadarData = JSON.stringify({
            label: ['Lifestyle', 'Body', 'Mind'],
            percentage: [
              [
                response.data.hra_point.lifestyle,
                response.data.hra_point.body,
                response.data.hra_point.mind
              ],
              [
                response.data.hra_point.body,
                response.data.hra_point.mind,
                response.data.hra_point.lifestyle
              ],
              [
                response.data.hra_point.mind,
                response.data.hra_point.lifestyle,
                response.data.hra_point.body
              ],
            ],
            height: 250,
          });


          this.rewardRedeemedGraphData = JSON.stringify({
            //label: ['January','February'],
            label: response.data.redeem_reward.map((item) => item.month),
            //percentage: ['12','33'],
            percentage: response.data.redeem_reward.map((item) => item.redeemCount),
            width: 250,
            colors: ['rgb(63, 81, 181)'],
            height: 250,
            mainLabel: ''
          });

          //Count gender
          let genderCount = this.countGender(response.data.gender);
          this.genEmpGraphData = JSON.stringify({
            label: genderCount.map((item) => item.gender),
            percentage: genderCount.map((item) => item.count),
            width: 250,
          });


          //attendance_averagehour
          this.attendance_averagehour = response.data.attendance

          //one time arrival
          this.onewtimeArrival = response.data.on_time_arrival

          //Attendance by month
          console.log(Object.values(response.data.hra_point).reduce((sum: any, el: any) => sum + el))
          this.challangeGuageData = JSON.stringify({
            label: '',
            //percentage: response.data.attendance_month,
            percentage: Object.values(response.data.hra_point).reduce((sum: any, el: any) => sum + el),
            height: 200,
          });

          //On leave
          this.onleaveToday = response.data.leave;

          //Remaining license
          this.licenseRemaining = response.data.licenseRemaining

          //Number Of Employees
          this.numberOfEmployee = response.data.numberOfEmployee

          localStorage.setItem("licence_record",JSON.stringify(response.data))

          //Celebrating Aniversary
          response.data.anniversaries.forEach((el: any) => {
            let date_moment: any = moment(el.anniversary);
            el.anniversary = moment(date_moment).format('DD MMMM')
          })
          this.celebrateAnniversary = response.data.anniversaries;


          //Celebrating Birthday
          response.data.birthday.forEach((el: any) => {
            let date_moment: any = moment(el.birthday);
            el.birthday = moment(date_moment).format('DD MMMM')
          })
          this.celebrateBirthday = response.data.birthday;
        } else {
        }
      },
      (err) => {
        const error = err.error;
      }
    );
  }

  // Get Employee List
  async getList() {
    this.ngxService.start();
    await this._api.getEmployee().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;

        if (response.success == true) {
          console.log(response.data)
          for (const item of response.data) {
            item.gender = !item.gender ? 'male' : item.gender;
          }

        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  //Active surveys
  async getActivesurvey() {
    let formData = {
      companyId: JSON.parse(localStorage.getItem('userData')).company_id
    }
    await (this._api.activeSurveyList(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.dashboardActiveSurvey = response.data.length;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // challanges list
  async getChallangesList() {
    this.ngxService.start();
    await this._api.getchallanges().subscribe(
      (res) => {
        this.ngxService.stop();
        const response = res;
        let responseData = response.data;
        console.log(responseData)

        let gData = [
          {
            name: '',
            data: [],
          },
        ];
        for (let item of responseData) {
          if (item.actin_Required == 1) {
            this.activeChallanges++;
            this.totalParticipant += Number(item.acceptedByAcceptUser);
          }
          gData[0].data.push({
            x: item.challenege_Name,
            y: item.acceptedByAcceptUser ? item.acceptedByAcceptUser : 0,
          });
        }
        if (gData[0].data.filter((item) => item.y > 0).length > 0) {
          this.heatGraph = JSON.stringify({ data: gData, color: '#3F51B5' });
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  //Get event
  async getEvent() {
    await this._api.getEvent().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          let colors = ['#3F51B5', ' #FFAA00', '#C86CE6', '#FF4081', '#15C1DC'];
          let count = 0;
          for (let item of response.data) {
            count++;
            let color = '#3F51B5';
            if (item.isType == 'holiday') {
              color = '#F44336';
            } else {
              color = colors[Math.floor(Math.random() * colors.length)];
            }
            let obj = {
              Id: count,
              Subject: item.event_Title,
              StartTime: new Date(
                `${item.event_StartDate} ${item.eventstartTime}`
              ),
              event_Location: item.Location,
              EndTime: new Date(`${item.event_EndDate} ${item.eventendTime}`),
              IsAllDay: item.isAllday,
              Description: item.event_Description,
              icon: item.fileName,
              EventType: item.event_Type == 0 ? 'event' : 'holiday',
              targetAudience: item.target_Audeince,
              calendarEvent_id: item.calendarEvent_id,
              IsType: item.IsType,
              CategoryColor: color,
              department: item.department,
              gender: item.gender,
              ageFrom: item.ageFrom ? item.ageFrom.toString() : '',
              ageTo: item.ageTo ? item.ageTo.toString() : '',
            };
            this.data.push(obj);
          }
          console.log(this.data)

          this.scheduleObj.eventSettings.dataSource = this.data;
          this.scheduleObj.refresh();
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }



  countGender(original) {
    console.log(original)
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].gender == (copy[w] && copy[w].gender)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          gender: original[i].gender,
          count: original[i].count,
        };
        compressed.push(a);
      }
    }
    return compressed;
  }

}
export interface PeriodicElement {
  name: string;
  position: any;
  designation: string;
  status: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: './assets/img/Ellipse_1.png',
    name: 'Romika gupta',
    designation: 'Sr. Associate',
    status: 0,
  },
  {
    position: './assets/img/Ellipse_1_g.png',
    name: 'Ryan Sandoval',
    designation: 'Manager Level 2',
    status: 1,
  },
  {
    position: './assets/img/Ellipse_1_gq.png',
    name: 'Fatima',
    designation: 'Director Manager',
    status: 2,
  },
  {
    position: './assets/img/Ellipse_1_gx.png',
    name: 'Romika gupta',
    designation: 'Sr. Associate',
    status: 0,
  },
  {
    position: './assets/img/Ellipse_1.png',
    name: 'Ryan Sandoval',
    designation: 'Manager Level 2',
    status: 1,
  },
  {
    position: './assets/img/Ellipse_1_g.png',
    name: 'Fatima',
    designation: 'Director Manager',
    status: 2,
  },
];
