import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import * as _moment from 'moment';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-survey',
  templateUrl: './detail-survey.component.html',
  styleUrls: ['./detail-survey.component.scss']
})
export class DetailSurveyComponent implements OnInit {
// set header column
displayedColumns: string[] = ['profile_picture', 'name', 'email',  'yesCount', 'action'];
displayedColumns1: string[] = ['survey_Title', 'yesCount'];

//set static data for table
dataSource = new MatTableDataSource([]);
//set static data for table
dataSource1 = new MatTableDataSource([{sno:1,question:'lorem ipsum doler sumit us',description:'Lorem ipsum dolor sit amet...'},
{sno:1,question:'lorem ipsum doler sumit us',description:'Lorem ipsum dolor sit amet...'},
{sno:1,question:'lorem ipsum doler sumit us',description:'Lorem ipsum dolor sit amet...'}]);

// table sorting and pagination
@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
@ViewChild(MatSort,{static:false}) sort: MatSort;

filePath = environment.apiBaseUrl
responseData:any = [];
questionDetailData:any = [];
userData:any = [];
csvFile:any = '';
newRequest:number = 0;
accessPermission:boolean;
graphData:any
attempted:any = 0;
notAttempted:any = 0;
formData = {
  "surveyTypeId" : null ,
	"companyId"    : 0
}
tabIndex:any = 0;
cardIndex:any = 0;
  constructor(public router:Router, public _access:AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let url  = this.router.url.split('/');
    this.formData.surveyTypeId = parseInt(url.pop());
    this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
  this.getList();
  this.getUserList();
}

// Get Leave List
async getList(){
this.ngxService.start();
await(this._api.attemptedQuestionSurvey(this.formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){
    console.log(response.data);
    this.responseData = response.data;
    for(let item of this.responseData){
      this.attempted = this.attempted + item.yesCount;
      this.notAttempted = this.notAttempted + item.noCount;
    }
    this.graphData = JSON.stringify({label:['Attempt','Not Attempt'],percentage:[this.attempted,this.notAttempted],colors:['#15C1DC','#FF6384']})
    this.getQuestionDetail(this.responseData[0].surveyQuestions_id,this.responseData[0].surveyType_Id)
  }else{
  }
  console.log(res);
}, err => {
  const error = err.error;
  this.ngxService.stop();
}));

}

// Get peticular question detail
async getQuestionDetail(id,subid){
  let fromData = {
    "surveyQuestionsId":id,
    "surveyTypeId" : subid ,
    "companyId"    : 0
 }
  this.ngxService.start();
  await(this._api.questionDetail(fromData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.questionDetailData = response.data;
      this.dataSource = new MatTableDataSource([...this.questionDetailData]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

  }
// Get Leave List
async getUserList(){
  this.ngxService.start();
  await(this._api.surveyUser(this.formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.userData = response.data;
      this.getUserSurveyDetail(this.userData[0].user_Id)
    }else{
      this.openErrrorSnackBar('This survery has no user');
      this.router.navigate(['/survey-list'])
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

  }

//user wise survey question
async getUserSurveyDetail(userId){
  let fromData = {
    "companyId":0,
    "userId":userId,
    "surveyTypeId":this.formData.surveyTypeId
    }
  await(this._api.individualResponsesSurvey(fromData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.dataSource1 = new MatTableDataSource([...response.data]);
      this.dataSource1.paginator = this.paginator;
      this.dataSource1.sort = this.sort;
      console.log(this.dataSource1);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));
}

roundFigure(number){
  return Math.round(number)
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
}
