import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import * as _moment from 'moment';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { StratSurveyComponent } from '../strat-survey/strat-survey.component';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { open } from 'fs';

@Component({
  selector: 'app-initiate-survey',
  templateUrl: './initiate-survey.component.html',
  styleUrls: ['./initiate-survey.component.scss']
})
export class InitiateSurveyComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['survey_Name', 'updated_At', 'initiate', 'action',];

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
    "company_Id": 0,
  }

  constructor(public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
  }

  // Get Leave List
  async getList() {
    this.ngxService.start();
    await (this._api.idleSurveyList(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
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
  // open start survey modal
  openSureyInitateModal(e) {
    const dialogRef = this.dialog.open(StratSurveyComponent, {
      width: '50%',
      data: {
        id: e
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList();
    });
  }

  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteSurvey(id);
      }
      else {
        this.getList()
      }
    });
  }

  async deleteSurvey(id) {
    console.log(id)
    let data =
    {
      "surveyTypeId": id
    }

    this.ngxService.start();
    await (this._api.surveyDelete(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));

  }

  //Searching
  applyFilter(event: Event) {
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

  getDate(d) {
    return _moment(d).format('DD MMM YYYY')
  }

}
