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
    user_id:'',
    branch_Id:'',
    first_name:'',
    last_name:'',
    email:'',
    reporting_Manager:'',
    department:'',
    role:null,
    employee_joiningDate:'',
    insurance_plan_name:'',

    salaryBalance:[],
    leaveBalance:[],

    working_HoursTo:'',
    working_HoursFrom:'',
    designation:'',
    company_id:null,
    ip_Address:'123',
	  created_By :'1',
    updated_By:'1',
    isType:1,
  }

  userData:any;
  files: File[] = [];
  roleData:any= [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<SubAdminEditComponent>) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.data.subAdmin);
    console.log(this.userData)
    this.formData = {
      user_id: this.userData.user_id,
      branch_Id: this.userData.branch_Id,
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
      email: this.userData.email,
      reporting_Manager: this.userData.reporting_Manager,
      department: this.userData.department,
      employee_joiningDate: this.userData.employee_joiningDate,
      insurance_plan_name: this.userData.insurance_plan_name,
      salaryBalance:this.userData.salaryBalance?JSON.parse(this.userData.salaryBalance):[],
      leaveBalance: this.userData.leaveBalance?JSON.parse(this.userData.leaveBalance):[],
      working_HoursTo: this.userData.working_HoursTo,
      working_HoursFrom: this.userData.working_HoursFrom,
      designation:this.userData.designation,
      company_id: this.userData.company_id,
      role: parseInt(this.userData.role),
      ip_Address: '123',
      created_By : JSON.parse(localStorage.getItem('userData')).user_id,
      updated_By: JSON.parse(localStorage.getItem('userData')).user_id,
      isType:1
    };
    this.formData.company_id = JSON.parse(localStorage.getItem('userData')).company_id;
    this.formData.created_By = JSON.parse(localStorage.getItem('userData')).user_id;
    this.formData.updated_By = JSON.parse(localStorage.getItem('userData')).user_id;
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
    await(this._api.updateEmployee(this.formData).subscribe(res => {
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
