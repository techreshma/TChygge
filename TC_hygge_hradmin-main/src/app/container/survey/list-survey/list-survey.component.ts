import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import * as _moment from 'moment';
import 'moment/locale/pt-br';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrls: ['./list-survey.component.scss']
})
export class ListSurveyComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['survey_Name', 'attempted', 'created_At', 'survey_ExpiryDate', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filePath = environment.apiBaseUrl
  responseData: any = [];
  csvFile: any = '';
  newRequest: number = 0;
  accessPermission: boolean;
  formData = {
    "companyId": "",
  }

  heightRecord: any = {
    isDefault: true,
    dasboard1: 'dashboard_card',
    dasboard2: 'dashboard_radar',
    dasboard3: 'dashboard_gauage',
    dasboard4: 'dashboard_maxline ',
    dasboard5: 'dashboard_donut',
    dasboard6: 'dashboard_line',
    dasboard7: 'dashboard_heatmap'
  }

  //#region dashboard garph variable 
  noOfSurveyConductedGraph: any;
  noOfRespondedGraph: any;
  numberResponsesRecieved: any;
  numberActiveSurvey: any;
  //#endregion

  constructor(
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
    this.surveyDashboard()
  }

  //survey dashboard
  async surveyDashboard() {
    //surveyDashboard
    await (this._api.surveyDashboard().subscribe(res => {
      const response: any = res;
      if (response.success == true) {


        //#region dashboard chart and card configuration start
        this.numberActiveSurvey = response.data.numberActiveSurvey;

        this.noOfSurveyConductedGraph = JSON.stringify({
          label: response.data.surveyConductedByMonth.map((item) => item.month),
          percentage: response.data.surveyConductedByMonth.map((item) => item.numbersof_survey),
          colors: ['#FF4081'],
          height: 250,
        })

        this.noOfRespondedGraph = JSON.stringify({
          label: response.data.respondedSurveys.map((item) => item.survey_name),
          percentage: response.data.respondedSurveys.map((item) => item.numberof_responded),
          colors: ['#15C1DC'],
          height: 250,
        });

        //#endregion
      } else { }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }))
  }
  // moment().format('MMMM Do YYYY, h:mm:ss a')

  // Get Leave List
  async getList() {
    this.ngxService.start();
    await (this._api.activeSurveyList(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        for (let item of response.data) {
          console.log(Date.parse(_moment(item.survey_ExpiryDate).format('LLLL')), Date.parse(_moment().format('LLLL')))
          if (((Date.parse(_moment(item.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL'))) < 864000000 && (Date.parse(item.survey_ExpiryDate) - Date.parse(_moment().format('LLLL'))) > 0) {
            item.expiry = 'current';
            item.survey_ExpiryDate = ((Date.parse(_moment(item.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL')))
          } else if (item.survey_ExpiryDate < _moment()) {
            item.expiry = 'expired'

          } else {
            item.expiry = 'remain'
            item.survey_ExpiryDate = _moment(item.survey_ExpiryDate).format('MMMM Do YYYY, h:mm:ss a')
          }
        }

        //#region dashboard chart and card configuration start
        response.data.forEach((el: any) => {
          el["totalUserAssign"] = el.totalUserAssign ? el.totalUserAssign : 0;
          el["totalUserSubmission"] = el.totalUserSubmission ? el.totalUserSubmission : 0;
        })

        let total: any = response.data.reduce(function (sum, itemtotal) {
          return sum + itemtotal.totalUserAssign
        }, 0);

        let recieved: any = response.data.reduce(function (sum, itemrecieved) {
          return sum + itemrecieved.totalUserSubmission;
        }, 0);

        this.numberResponsesRecieved = recieved + " / " + total
        //#endregion

        this.responseData = response.data;
        this.dataSource = new MatTableDataSource([...this.responseData]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // send reinder to user
  async reminderSurvey(id) {
    let formData = {
      "companyId": JSON.parse(localStorage.getItem('userData')).company_id,
      "surveyTypeId": id
    }
    this.ngxService.start();
    await (this._api.reminderAllUserSurvey(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));

  }

  activeSurvey(element: any, rowel: any) {
    console.log("Element", element)
    console.log("Rows", rowel)
    console.log("Rows by survey Id", rowel.surveyQuestions_Id)
    this.router.navigateByUrl(['active-survey/'] + rowel.surveyQuestions_Id)
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTime(time) {
    return _moment(time).format('DD MMM YYYY')
  }

  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert']
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert']
    });
  }

  currentTime() {
    return _moment().format('hh : mm : ss')
  }

}
