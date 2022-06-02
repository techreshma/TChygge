import { Component, Inject, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  employee: string;
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
import { environment } from "../../../../environments/environment";

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

export interface DialogData {
  insurance: string;
}

@Component({
  selector: 'app-insurance-edit',
  templateUrl: './insurance-edit.component.html',
  styleUrls: ['./insurance-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class InsuranceEditComponent implements OnInit {
  currentDate = new Date();
  formData = {
    "insuranceDetail_id": '',
    "insurance_Name": '',
    "expiryDate": new Date(),
    "insurance_Plan": '',
    "insurance_Benefit": '',
    "network": '',
    "ip_Address": '123',
    "description": '',
    "networkType": '0',
    "benefitType": '0'
  };
  roleData: any = [];
  files: any = [];
  files1: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<InsuranceEditComponent>) { }

  ngOnInit(): void {
    // this.formData.company_id = JSON.parse(localStorage.getItem('userData')).company_id;

    this.formData.insurance_Name = JSON.parse(this.data.insurance).main.insuranceName;
    let d = (JSON.parse(this.data.insurance).sub.expiry_Date).split('/')
    this.formData.expiryDate = new Date(d[1] + '-' + d[0] + '-' + d[2]);
    this.formData.insurance_Plan = JSON.parse(this.data.insurance).sub.insurance_Plan;
    this.formData.insurance_Benefit = environment.apiBaseUrl + JSON.parse(this.data.insurance).sub.insurance_Benefit;
    this.formData.network = environment.apiBaseUrl + JSON.parse(this.data.insurance).sub.network;
    this.formData.insuranceDetail_id = JSON.parse(this.data.insurance).sub.insuranceDetail_id;
    this.formData.description = JSON.parse(this.data.insurance).sub.description;
    this.formData.networkType = JSON.parse(this.data.insurance).sub.networkType;
    this.formData.benefitType = JSON.parse(this.data.insurance).sub.benefitType;
    console.log(this.formData.benefitType)
    console.log(this.formData.networkType)
  }



  // edit new Insurance
  async editInsurance() {
    console.log(this.formData)
    await (this._api.editInsurance(this.formData).subscribe(res => {
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

  openLink(link) {
    console.log(link)
  }

  // upload Table of benifits
  async onSelect(event) {
    console.log(event);
    this.files = [...event.addedFiles];
    if (event.addedFiles.length > 0) {

      await (this._api.uploadThemeDoc(event.addedFiles[0], 'insuranceDoc').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.formData.insurance_Benefit = response.data;

        } else {
          this.openSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    } else {
      this.openErrrorSnackBar('File size is too large');
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  // upload network
  async onSelect1(event) {
    console.log(event);
    this.files1 = [...event.addedFiles];
    if (event.addedFiles.length > 0) {

      await (this._api.uploadThemeDoc(event.addedFiles[0], 'insuranceDoc').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.formData.network = response.data;

        } else {
          this.openSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    } else {
      this.openErrrorSnackBar('File size is too large');
    }
  }

  onRemove1(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
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
