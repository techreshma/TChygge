import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  subAdmin: string;
}

@Component({
  selector: 'app-sub-admin-edit',
  templateUrl: './sub-admin-edit.component.html',
  styleUrls: ['./sub-admin-edit.component.scss']
})
export class SubAdminEditComponent implements OnInit {
  imgPath = environment.apiBaseUrl;
  imgShow:any = ''
  formData = {
    "superAdmin_id"              : "",
    "first_name"      : "",
    "last_name"       : "",
    "email"           : "",
    "profile_picture" : "",
    "address"         : "",
    "mobile"          : "",
    "role"            : "",
    "ip_Address"      : "111"
  }

  subAdminData:any;
  files: File[] = [];
  roleData:any= [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<SubAdminEditComponent>) { }

  ngOnInit(): void {
    this.subAdminData = JSON.parse(this.data.subAdmin);
    console.log(this.subAdminData.position)
    this.formData = {
      "superAdmin_id"   : this.subAdminData.id,
      "first_name"      : (this.subAdminData.name.split(' '))[0],
      "last_name"       : (this.subAdminData.name.split(' '))[1],
      "email"           : this.subAdminData.email,
      "profile_picture" : this.subAdminData.position,
      "address"         : '',
      "mobile"          : '',
      "role"            : this.subAdminData.role,
      "ip_Address"      : "12345"
    }

    this.imgShow = `${environment.apiBaseUrl}${this.subAdminData.position}`;
    this.getRole();
  }

// Get Role Type
async getRole(){
  this.ngxService.start();
  await(this._api.getRole().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data)
      this.roleData = response.data;
      console.log(this.roleData)
    }else{
    }
    console.log(res);
  },err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}


  // add new Sub Admin
  async editSubAdmin(){
    this.ngxService.start();
    await(this._api.updateSubAdmin(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
      }else{
        this.openSnackBar(response.message);
      }
      console.log(res);
      this.dialogRef.close('Close');
    },err => {
      const error = err.error;
      this.openSnackBar(error.message);
      this.ngxService.stop();
    }));
  }
  // onSelect image
  async onSelect(event) {
    console.log(event);
    this.files=[...event.addedFiles];
    if(event.addedFiles.length > 0){
      await(this._api.uploadDoc(event.addedFiles[0]).subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.formData.profile_picture = response.data;
          this.imgShow = `${environment.apiBaseUrl}${response.data}`;

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

  // onRemove image
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
}
