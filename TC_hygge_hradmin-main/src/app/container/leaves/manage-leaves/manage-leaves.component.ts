import { Component, Inject, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  leaveData: string;
}
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {defaultFormat as _rollupMoment} from 'moment';

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
  selector: 'app-manage-leaves',
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.scss'],
  providers: [
  {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ManageLeavesComponent implements OnInit {
  getAllData:any
  formData = {
    "isType":"",
    "leaveDetailsId":"",
    "userId":"",
    "companyId":"",
    "ip_Address":"123,22.12",
    "leaveName":"",
    "leaveDescription":"" ,
    "leaveFrom":'' ,
    "leaveTo":'' ,
    "fromHour": "00:00:00",
    "toHour": "00:00:00",
    "hrReason":"",
    "isLeave":null,
    "leaveType_Id":''
    };

  employeeList:any= [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ManageLeavesComponent>) { }

  ngOnInit(): void {
    this.getAllData = JSON.parse(this.data.leaveData)
    console.log(this.getAllData);
    this.formData.leaveName = this.getAllData.leave_Type;
    this.formData.leaveDescription = this.getAllData.leave_description;
    this.formData.leaveDetailsId = this.getAllData.leaveDetails_id;
    this.formData.leaveFrom = _moment(this.getAllData.leave_From).format('');
    this.formData.leaveTo = _moment(this.getAllData.leave_To).format('');
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.formData.userId = this.getAllData.user_Id;
    this.formData.leaveType_Id = this.getAllData.leaveType_Id;
  }


// Update leave
async updateLeave(){
  if(this.formData.isType == ''){
    this.openErrrorSnackBar('Please select Action type to update this request')
  }else{
    console.log(this.formData.isType)
    if(this.formData.isType == 'reject'){
      this.formData.isLeave = 2;
    }else if(this.formData.isType == 'accept'){
      this.formData.isLeave = 1;
    }else if(this.formData.isType == 'cancel'){
      this.formData.isLeave = 3;
    }else{
      this.formData.isLeave = 0;
    }
    this.formData.isType = (this.formData.isType == 'reject' || this.formData.isType == 'accept')?'request':this.formData.isType;
    console.log(this.formData.isLeave)
    this.ngxService.start();
    await(this._api.modifyEmployeeleave(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message)
      this.dialogRef.close('close');
      }else{
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));
  }

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
