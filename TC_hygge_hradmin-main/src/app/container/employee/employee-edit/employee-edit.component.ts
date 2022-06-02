import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  employee: string;
}

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';


// const moment = _rollupMoment || _moment;

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
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class EmployeeEditComponent implements OnInit {
  formData = {
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    reporting_Manager: '',
    department: '',
    employee_joiningDate: '',
    insurance_plan_name: null,
    leaveBalance: [],
    salaryBalance: [],
    working_HoursTo: '',
    branch_Id: 0,
    working_HoursFrom: '',
    company_id: null,
    role: 0,
    designation: '',
    ip_Address: '123',
    created_By: '',
    updated_By: '',
    isType: 0
  };

  employeeData: any;
  roleData: any = [];
  departmentData: any = [];
  leaveData: any = [];
  salaryData: any = [];
  employeeList: any = [];
  branchData: any = [];
  insuranceData: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<EmployeeEditComponent>) { }

  ngOnInit(): void {
    this.employeeData = JSON.parse(this.data.employee);
    console.log(this.employeeData)
    let leavBal = this.employeeData.leaveBalance ? JSON.parse(this.employeeData.leaveBalance) : [];
    let salBal = this.employeeData.salaryBalance ? JSON.parse(this.employeeData.salaryBalance) : [];
    let salBalDummy = [];
    let leavBalDummy = []
    for (let item of salBal) {
      for (let key of Object.keys(item)) {
        console.log(key)
        salBalDummy.push({
          s: key,
          val: item[key]
        })
      }
    }
    for (let item of leavBal) {
      for (let key of Object.keys(item)) {
        leavBalDummy.push({
          s: key,
          val: item[key]
        })
      }
    }

    this.formData = {
      user_id: this.employeeData.user_id,
      first_name: this.employeeData.first_name,
      last_name: this.employeeData.last_name,
      email: this.employeeData.email,
      reporting_Manager: this.employeeData.reporting_Manager,
      branch_Id: this.employeeData.branch_Id,
      department: this.employeeData.department,
      employee_joiningDate: this.employeeData.employee_joiningDate,
      insurance_plan_name: parseInt(this.employeeData.insurance_plan_name),
      salaryBalance: salBalDummy,
      leaveBalance: leavBalDummy,
      working_HoursTo: this.employeeData.working_HoursTo,
      working_HoursFrom: this.employeeData.working_HoursFrom,
      designation: this.employeeData.designation,
      company_id: this.employeeData.company_id,
      role: 0,
      ip_Address: '123',
      created_By: JSON.parse(localStorage.getItem('userData')).user_id,
      updated_By: JSON.parse(localStorage.getItem('userData')).user_id,
      isType: 0
    };
    this.getRole();
    this.getDepartment();
    this.getLeave();
    this.getSalary();
    this.getList()
    this.getInsuranceList()
    this.getBranchList();
  }

  // Branch list
  async getBranchList() {
    this.ngxService.start();
    await (this._api.getBranch().subscribe(res => {
      this.ngxService.stop();
      const response = res;
      if (response.success == true) {
        this.branchData = response.data
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  // Get Insurance List
  async getInsuranceList() {
    this.ngxService.start();
    await (this._api.showInsurance().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);

        this.insuranceData = response.data;
        console.log(this.insuranceData);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }


  // Get Leave
  async getLeave() {
    // console.log(this.formData.leaves)
    this.ngxService.start();
    await (this._api.showLeave().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.leaveData = response.data;
        // let t = this.leaveData.length - this.formData.leaveBalance.length;
        // console.log(t)
        // for(let i = (this.leaveData.length - t); i <= this.leaveData.length; i++){
        //   let obj = {};
        //   obj[this.leaveData[i-1].leave_Type] = '';
        //   this.formData.leaveBalance.push(obj);
        // }
        // console.log(this.formData.leaveBalance)
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

  // Get Salary breakdown
  async getSalary() {
    this.ngxService.start();
    await (this._api.showSalary().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.salaryData = response.data;

        // let t = this.salaryData.length - this.formData.salaryBalance.length;
        // console.log(t)
        // for(let i = (this.salaryData.length - t); i <= this.salaryData.length; i++){
        //   let obj = {};
        //   obj[this.salaryData[i-1].salary_Type] = '';
        //   this.formData.salaryBalance.push(obj);
        // }
        // console.log(this.formData.salaryBalance)

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
  // Get Role Type
  async getRole() {
    this.ngxService.start();
    await (this._api.getRole().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
        this.roleData = response.data;
        console.log(this.roleData);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // Get Department
  async getDepartment() {
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

  // add new Sub Admin
  async editEmployee() {
    let sal = [];
    let leav = [];
    for (let item of this.formData.salaryBalance) {
      sal.push({
        [item.s]: item.val
      })
    }
    for (let item of this.formData.leaveBalance) {
      leav.push({
        [item.s]: item.val
      })
    }

    this.formData.salaryBalance = sal;
    this.formData.leaveBalance = leav;
    this.ngxService.start();
    let hoursFrom = moment(this.formData.working_HoursFrom + ":00").format('HH:mm:ss')
    let hoursTo = moment(this.formData.working_HoursTo + ":00").format('HH:mm:ss')

    console.log(hoursFrom, hoursTo)


    await (this._api.updateEmployee(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
      } else {
        this.openErrrorSnackBar(response.message);
      }
      this.dialogRef.close('Close');
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  onTimeChange(event: any, mode: any) {
    let time: any = event.target.value
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    console.log(sHours + ":" + sMinutes)
  }

  //Joining date Function
  joiningDateFunc(event: any) {
    this.formData.employee_joiningDate = moment(event.target.value).format('YYYY-MM-DD')

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
