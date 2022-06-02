import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  id: string;
}
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
  selector: 'app-strat-survey',
  templateUrl: './strat-survey.component.html',
  styleUrls: ['./strat-survey.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class StratSurveyComponent implements OnInit {
  formData: any = {
    "surveyQuestions_Id": "",
    "company_Id": "0",
    "user_Id": "",
    "survey_AgeTo": null,
    "survey_CompanyId": null,
    "survey_AgeFrom": null,
    "survey_Gender": null,
    "survey_Department": null,
    "survey_ExpiryDate": "2021-01-31",
    "survey_ExpiryTime": "10:20",
    "ip_Address": "12.43.544.33",

  }
  minDate = new Date();
  companyList: any = []
  ageColumn: any = [];
  departmentData: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<StratSurveyComponent>) { }

  ngOnInit(): void {
    for (let i = 18; 100 > i; i++) {
      this.ageColumn.push({ text: i, value: i })
    }
    this.formData.surveyQuestions_Id = this.data.id;
    this.formData.user_Id = JSON.parse(localStorage.getItem('userData')).superAdmin_id;
    this.getDepartment();
    this.getList()
  }

  // Get Department
  async getDepartment() {
    this.ngxService.start();
    await (this._api.showDepartment().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.departmentData = response.data;
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
  // add new role
  async initiateSurvey() {
    this.formData.survey_Gender = parseInt(this.formData.survey_Gender)
    this.formData.survey_ExpiryDate = _moment(this.formData.survey_ExpiryDate).format('YYYY-MM-DD')

    // this.formData.survey_AgeTo = this.formData.survey_AgeTo === "" ? 100  : this.formData.survey_AgeTo;
    // this.formData.survey_AgeFrom = this.formData.survey_AgeFrom === "" ? 0  : this.formData.survey_AgeFrom;
    console.log(this.formData)
    this.ngxService.start()
    await (this._api.initiatedSurvey(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
      this.dialogRef.close('Close');
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  // Get Company List
  async getList() {
    this.ngxService.start();
    await (this._api.getCompany().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
        this.companyList = response.data;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

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
