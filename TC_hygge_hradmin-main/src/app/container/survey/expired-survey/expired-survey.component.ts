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

@Component({
  selector: 'app-expired-survey',
  templateUrl: './expired-survey.component.html',
  styleUrls: ['./expired-survey.component.scss']
})
export class ExpiredSurveyComponent implements OnInit {

// set header column
displayedColumns: string[] = ['survey_Name', 'attempted',  'created_At', 'survey_ExpiryDate','action'];

//set static data for table
dataSource = new MatTableDataSource([]);

// table sorting and pagination
@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
@ViewChild(MatSort,{static:false}) sort: MatSort;

filePath = environment.apiBaseUrl
responseData:any = [];
csvFile:any = '';
newRequest:number = 0;
accessPermission:boolean;
formData = {
  "companyId":"",
}

constructor(public _access:AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

}

ngOnInit(): void {
  this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
//getting access permission
  this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
  this.getList();
}

// Get Leave List
async getList(){
this.ngxService.start();
await(this._api.archiveSurvey(this.formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){
    for(let item of response.data){
      console.log(Date.parse(_moment(item.survey_ExpiryDate).format('LLLL')), Date.parse(_moment().format('LLLL')))
       if(((Date.parse(_moment(item.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL'))) < 864000000 && (Date.parse(item.survey_ExpiryDate) - Date.parse(_moment().format('LLLL'))) > 0){
        item.expiry = 'current';
        item.survey_ExpiryDate = ((Date.parse(_moment(item.survey_ExpiryDate).format('LLLL'))) - Date.parse(_moment().format('LLLL')))
      }else if(Date.parse(item.survey_ExpiryDate) <= Date.parse(_moment().format())){
        item.expiry = 'expired'

      }else{
        item.expiry = 'remain'
        item.survey_ExpiryDate = _moment(item.survey_ExpiryDate).format('DD MMM  YYYY')
      }
    }
    this.responseData = response.data;
    this.dataSource = new MatTableDataSource([...this.responseData]);
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



//Searching
applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
getTime(time){
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

  currentTime(){
    return _moment().format('hh : mm : ss')
  }

}
