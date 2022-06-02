import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  userId: string;
}

@Component({
  selector: 'app-missing-list',
  templateUrl: './missing-list.component.html',
  styleUrls: ['./missing-list.component.scss']
})
export class MissingListComponent implements OnInit {
  dependent:any;
  employeeData: any;
  id:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialoge: MatDialog,  public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<MissingListComponent>) { }

  ngOnInit(): void {
    this.id = JSON.parse(this.data.userId);
    console.log(this.id);
    this.getMissingField();
  }


// Get Role Type
async getMissingField(){
  let formData = {
    "userId":this.id,
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "isType ":0
  }
  this.ngxService.start();
  await(this._api.missingDoc(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.employeeData = response.data;
      this.dependent = response.dependent;
      console.log(this.employeeData);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

// Get Role Type
async mailMissingField(n){
  let formData = {
    "userId":this.id,
    "companyId":JSON.parse(localStorage.getItem('userData')).company_id,
    "isType ":n
  }
  this.ngxService.start();
  await(this._api.missingDoc(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.dialoge.closeAll()
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
