import { Component, Inject, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@Component({
  selector: 'app-leave-add',
  templateUrl: './leave-add.component.html',
  styleUrls: ['./leave-add.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class LeaveAddComponent implements OnInit {
  getAllData: any
  leaveType: any;
  formData = {
    "TypeId": null, //leave type id
    "leave_From": new Date(),
    "leave_To": new Date(),
    user_reason: "",
    "leave_description": "",
    "leave_Number": 1,
    "ip_Address": "123.432.22.33",
    "user_Id": "",
    "company_Id": "",
    "leave_Name": "",
    "to_Hour": "00:00:00",
    "from_Hour": "00:00:00"
  };

  employeeList: any = [];
  leaveData: any = [];
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<LeaveAddComponent>) { }

  ngOnInit(): void {
    this.formData.company_Id = JSON.parse(localStorage.getItem('userData')).company_id;
    this.getList();
    this.getLeave();
  }


  // Add leave
  async addLeave() {
    this.ngxService.start();
    console.log(this.formData)
    await (this._api.addLeaveEmployee(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.dialogRef.close('close');
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

  // Get Leave
  async getLeave() {
    this.ngxService.start();
    await (this._api.showLeave().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.leaveData = response.data;
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
  }
  // Get Employee List
  async getList() {
    this.ngxService.start();
    await (this._api.getEmployee().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
        this.employeeList = response.data;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  getLeaveType(e) {
    this.formData.TypeId = e.leaveType_id;
    this.formData.leave_Name = e.leave_Type;
  }

  getDays(e, type) {

    var date1 = new Date(_moment(this.formData.leave_From).format('MM/DD/YYY'));
    var date2 = new Date(_moment(this.formData.leave_To).format('MM/DD/YYY'));

    if (type == 'from') {
      var date1 = new Date(_moment(e).format('MM/DD/YYY'));
    }
    if (type == 'to') {
      var date2 = new Date(_moment(e).format('MM/DD/YYY'));
    }

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    //To display the final no. of days (result)
    this.formData.leave_Number = Difference_In_Days;

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
