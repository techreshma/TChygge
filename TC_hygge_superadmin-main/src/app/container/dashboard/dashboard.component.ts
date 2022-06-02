import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';

import {
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  ScheduleComponent,

} from '@syncfusion/ej2-angular-schedule';
import * as moment from 'moment';



@Component({
  providers: [DayService, WeekService, WorkWeekService, MonthService],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})

export class DashboardComponent implements OnInit {
  @ViewChild('scheduleObj', { static: true })
  public scheduleObj: ScheduleComponent;

  notifications: number = 0;
  messages: number = 0;
  contract_expiry: number = 0;

  hraRadarData: any;
  chartOptions: any;

  activeCompany: number = 0;
  activeChallanges: number = 0;
  activeSurveys: number = 0;

  heatGraph: any = JSON.stringify({ data: { title: 'Participants per Challenge' }, color: '#3F51B5' });

  activeUserChart: any;
  companySubsChart: any;
  rewardRedeemChart: any;

  numberActiveuserTitle: any = '';

  heightRecord: any = {
    isDefault: true,
    isLineChart: true,
    dasboard1: 'dashboard_card',
    dasboard2: 'dashboard_radar',
    dasboard3: 'dashboard_gauage',
    dasboard4: 'dashboard_maxline ',
    dasboard5: 'dashboard_donut',
    dasboard6: 'dashboard_line',
    dasboard7: 'dashboard_heatmap'
  }

  lifeStyleColors: any = '';
  bodyColors: any = '';
  mindColors: any = '';

  gridView: any = [];

  public eventSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false,
    dataSource: [],
  };
  public selectedDate: Date = new Date();


  public minDate: Date = new Date();



  constructor(
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    //this.getChallangesList();
    this.getDashboardDetail();

    this.scheduleObj.eventSettings.dataSource = [{
      CategoryColor: "#F44336",
      Description: "holiday",
      EndTime: '2021/10/11',
      EventType: "event",
      Id: 1,
      IsAllDay: 1,
      IsType: undefined,
      StartTime: '2021/10/13',
      Subject: "Commemoration Day",
      ageFrom: "",
      ageTo: "",
      calendarEvent_id: 560,
      department: "0",
      event_Location: undefined,
      gender: "0",
      icon: "gergerge"
    }]

    this.scheduleObj.refresh();
  }

  async getDashboardDetail() {
    await (this._api.mainDashboardApi().subscribe(res => {
      this.ngxService.stop();
      const response = res;
      if (response.success === true) {

        //Open Action
        this.notifications = response.data.Open_action.notification ? response.data.Open_action.notification : 0;
        this.messages = response.data.Open_action.messages ? response.data.Open_action.messages : 0;
        this.contract_expiry = response.data.Open_action.contract_expiry ? response.data.Open_action.contract_expiry : 0;

        //Hra points
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
          colors: ['#c35bde', '#ff3399', '#ffaa2a']
        })

        this.lifeStyleColors = JSON.parse(this.hraRadarData).colors[0]
        this.bodyColors = JSON.parse(this.hraRadarData).colors[1]
        this.mindColors = JSON.parse(this.hraRadarData).colors[2]


        //Speedometer
        this.chartOptions = JSON.stringify({
          label: '',
          percentage: Object.values(response.data.hra_point).reduce((sum: any, el: any) => sum + el),
          height: 200,
        });

        this.activeCompany = response.data.active_Companies;
        this.activeChallanges = response.data.activeChallenges_count;
        this.activeSurveys = response.data.activeSurveys_count;


        this.activeUserChart = JSON.stringify({
          label: response.data.number_activeUserMonthly.map((item) => item.month),
          percentage: response.data.number_activeUserMonthly.map((item) => item.value),
          colors: ['#FF4081'],
          height: 350,
        })

        this.companySubsChart = JSON.stringify({
          label: response.data.companies_basedOnSubscription.map((item) => item.name),
          percentage: response.data.companies_basedOnSubscription.map((item) => item.count),
          width: 250,
        })

        this.rewardRedeemChart = JSON.stringify({
          label: response.data.rewardsRedeemed_monthly.map((item) => item.month),
          percentage: response.data.rewardsRedeemed_monthly.map((item) => item.count),
          colors: ['#0190FF'],
          height: 250
        })

        response.data.participants_Challenge.forEach((el: any) => {
          this.gridView.push({
            size: '20%', name: el.challenege_Name, value: el.acceptedByTotalUser
          })
        })
        /*
          participants_Challenge: [{challengePredefined_id: 1, challenege_Name: "Steps", acceptedByTotalUser: 0},…]
        */
      }
    }, err => {
      const error = err.error;
    }));
  }

  async getChallangesList() {
    this.ngxService.start();
    await (this._api.getchallanges().subscribe(res => {
      this.ngxService.stop();
      const response = res;
      let responseData = response.data;
      let gData = [{
        name: "",
        data: []
      }]

      console.log(responseData)

      for (let item of responseData) {
        if (item.actin_Required == 1) {
          this.activeChallanges++;
        }
        gData[0].data.push({ x: item.challenege_Name, y: item.acceptedByAcceptUser ? item.acceptedByAcceptUser : 0 })
      }
      if ((gData[0].data.filter(item => item.y > 0)).length > 0) {
        console.log(gData)
        //  this.heatGraph = JSON.stringify({ data: gData, color: '#3F51B5' })
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }
}

export interface PeriodicElement {
  name: string;
  position: any;
  designation: string;
  status: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: './assets/img/Ellipse_1.png', name: 'Romika gupta', designation: 'Sr. Associate', status: 0 },
  { position: './assets/img/Ellipse_1_g.png', name: 'Ryan Sandoval', designation: 'Manager Level 2', status: 1 },
  { position: './assets/img/Ellipse_1_gq.png', name: 'Fatima', designation: 'Director Manager', status: 2 },
  { position: './assets/img/Ellipse_1_gx.png', name: 'Romika gupta', designation: 'Sr. Associate', status: 0 },
  { position: './assets/img/Ellipse_1.png', name: 'Ryan Sandoval', designation: 'Manager Level 2', status: 1 },
  { position: './assets/img/Ellipse_1_g.png', name: 'Fatima', designation: 'Director Manager', status: 2 },
];
