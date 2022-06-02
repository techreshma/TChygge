import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

length:number = 100;
pageSize:number = 10;
pageSizeOptions: number[] = [5, 10, 25, 100];

pageEvent: PageEvent;

// set header column
displayedColumns: string[] = ['picture', 'date','company' ,'status'];
//displayedColumns: string[] = ['picture','name', 'date','company' ,'status'];

// set static data for table
dataSource = new MatTableDataSource([]);

// table sorting and pagination
@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
@ViewChild(MatSort, {static: false}) sort: MatSort;

responseData: any = [];
accessPermission: boolean;

totalQuestions:number = 26;
imgPath:any = environment.apiBaseUrl;
constructor( public router: Router,public _access: AccessServiceService,  public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
}

ngOnInit(): void {
// getting access permission
  this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
  this.getList(0,10);
}
paginationChange(e){
  this.pageEvent = e
  console.log(this.pageEvent)
  this.getList(e.pageIndex,e.pageSize);
}

// Get HRA List
async getList(page,pagination){
let formData = {
  "page":page,
  "pagination":pagination
}
this.ngxService.start();
await(this._api.hraUserList(formData).subscribe(res => {
  this.ngxService.stop();
  const response: any = res;
  if (response.success == true){
    this.dataSource = new MatTableDataSource([...response.data]);
    this.length = response.length;
    console.log(this.dataSource);
  }else{
  }
  console.log(res);
}, err => {
  const error = err.error;
  this.ngxService.stop();
}));

}

// Searching
applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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



// get attempted percentage
  getPercentage(at){
    return ((at/this.totalQuestions) * 100)
  }

//heightlight row
getClass(row){
  if(row.dependentQuestionId != 0){
    return true
  }else{
    return false
  }
}


}
