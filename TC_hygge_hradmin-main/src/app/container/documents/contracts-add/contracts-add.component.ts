import { Component, Inject, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from '../../../../environments/environment';
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


import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  file: string;
}
@Component({
  selector: 'app-contracts-add',
  templateUrl: './contracts-add.component.html',
  styleUrls: ['./contracts-add.component.scss'],
  providers: [
  {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ContractsAddComponent implements OnInit {
  isExpire = false;
  filePath = environment.apiBaseUrl;
  formData = {
    "userId":"",
    "document_Title":"",
    "file_Type":"",
    "DocType":"",
    "expiry_Date":"",
    "file_Path":"",
    "dependentType":'0',
  };
  files:File[]=[]
  roleData: any = [];
  docData:any = [];
  currentDate = new Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ContractsAddComponent>) { }

  ngOnInit(): void {
    this.formData.file_Path = this.data.file;
    console.log(this.formData.file_Path)
    this.getEmployee();
    this.getDocType();
  }

// Get Role Type
async getEmployee(){
  this.ngxService.start();
  await(this._api.showEmployeeName().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.roleData = response.data;
      console.log(this.roleData);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

// Get Doc Type
async getDocType(){
  this.ngxService.start();
  await(this._api.showDocType().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.docData = response.data;
    }else{
    }
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}


// add new Doc
async addDoc(){
  await(this._api.addDoc(this.formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
    }else{
      this.openSnackBar(response.message);
    }
    console.log(res);
    this.dialogRef.close('Close');
  }, err => {
    const error = err.error;
    this.openSnackBar(error.message);
    this.ngxService.stop();
  }));
}

// upload logo image
async onSelect(event) {
  console.log(event);
  this.files = [...event.addedFiles];
  if(event.addedFiles.length > 0){

    await(this._api.uploadDocDoc(event.addedFiles[0]).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        console.log(response.data[0])
        this.formData.file_Path = response.data[0];

      }else{
        this.openSnackBar(response.message);
      }
      console.log(res);
    },err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }else{
    this.openErrrorSnackBar('File size is too large');
  }
}

onRemove(event) {
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
docCheck(e){
  for(let item of this.docData){
    if(item.documentType_id == e){
      if(item.expires == 1){
        this.isExpire = true
      }else{
        this.isExpire = false
      }
    }
  }
}
}
