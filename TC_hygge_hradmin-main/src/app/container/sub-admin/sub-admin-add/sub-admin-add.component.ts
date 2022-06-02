import { Component, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sub-admin-add',
  templateUrl: './sub-admin-add.component.html',
  styleUrls: ['./sub-admin-add.component.scss']
})
export class SubAdminAddComponent implements OnInit {
  user:any;
  formData = {
    user_id: '',
    first_name:'',
    last_name:'',
    email:'',
    reporting_Manager:'',
    department:'',
    role:null,
    designation:'',
    employee_joiningDate:'',
    insurance_plan_name:'',

    salaryBalance:[],
    leaveBalance:[],

    working_HoursTo:'',
    working_HoursFrom:'',

    company_id:null,
    ip_Address:'123',
	  created_By :'1',
    updated_By:'1',
    isType:1,
  }
  files: File[] = [];
  roleData:any= [];
  employeeList:any = [];
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<SubAdminAddComponent>) { }

  ngOnInit(): void {
    this.formData.company_id = JSON.parse(localStorage.getItem('userData')).company_id;
    this.formData.created_By = JSON.parse(localStorage.getItem('userData')).user_id;
    this.formData.updated_By = JSON.parse(localStorage.getItem('userData')).user_id;
    this.getRole();
    this.getList()
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

// Get Employee List
async getList(){
  this.ngxService.start();
  await(this._api.getEmployee().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      this.employeeList = response.data;
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

//set user data
getUserDetail(event){
  this.formData = {
    user_id: event.user_id,
    first_name: event.first_name,
    last_name: event.last_name,
    email: event.email,
    reporting_Manager: event.reporting_Manager,
    department: event.department,
    employee_joiningDate: event.employee_joiningDate,
    insurance_plan_name: event.insurance_plan_name,
    salaryBalance:event.salaryBalance?JSON.parse(event.salaryBalance):[],
    leaveBalance: event.leaveBalance?JSON.parse(event.leaveBalance):[],
    working_HoursTo: event.working_HoursTo,
    working_HoursFrom: event.working_HoursFrom,
    designation:event.designation,
    company_id: event.company_id,
    role: this.formData.role,
    ip_Address: '123',
    created_By : JSON.parse(localStorage.getItem('userData')).user_id,
    updated_By: JSON.parse(localStorage.getItem('userData')).user_id,
    isType:1
  };
}

  // add new Sub Admin
  async addSubAdmin(){
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
