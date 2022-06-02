import { Component, Inject, OnInit } from '@angular/core';
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
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';

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
  selector: 'app-csv-data',
  templateUrl: './csv-data.component.html',
  styleUrls: ['./csv-data.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class CsvDataComponent implements OnInit {
  csvFile: any = [];
  employeeData: any;
  roleData: any = [];
  departmentData: any = [];
  leaveData: any = [];
  salaryData: any = [];
  employeeList: any = [];
  insuranceData: any = []
  branchData: any = [];
  validate: boolean;
  emptyCount: number = 0;
  fillCount: number = 0;
  designationData = ["President",
    "Chairman Chief",
    "Executive Officer",
    "Managing Director",
    "General Manager",
    "Director",
    "Vice President",
    "Asst General Manager",
    "Chief Operating Officer",
    "Chief Marketing Officer",
    "Chief Technology Officer",
    "Chief People Officer",
    "Chief Innovation Officer",
    "Asst General Manager",
    "Asst Director",
    "Asst Vice President",
    "Finance Manager",
    "Purchasing Manager",
    "Operating Manager",
    "HR & Admin Manager",
    "Sales Manager",
    "Marketing Manager",
    "Business Development Manager",
    "Transformation Officer",
    "Manager",
    "Head of the Department",
    "Team Leader",
    "Asst Manager",
    "Asst Manager Finance",
    "Asst Manager HR & Admin",
    "Senior Engineer",
    "Accountant",
    "Senior Accountant",
    "HR & Admin Executive",
    "Personal Assistant",
    "Executive",];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<CsvDataComponent>) {

    this.employeeData = JSON.parse(this.data.employee);
    this.validateData()
    console.log(this.employeeData)
  }

  ngOnInit(): void {
    this.getSampleCsv();
    this.getRole();
    this.getDepartment();
    this.getLeave();
    this.getSalary();
    this.getList()
    this.getInsuranceList()
    this.getBranchList()
  }


  // Get sample csv
  async getSampleCsv() {
    this.ngxService.start();
    await (this._api.getSampleCsv().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        // this.openSnackBar(response.message);
        this.csvFile = response.data;
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
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
        for (let item of response.data) {
          item['Insurance_PlanName'] = item.insuranceDetail_id.toString();

        }
        this.insuranceData = response.data;
        for (let item of this.employeeData) {
          let id = this.insuranceData.findIndex(d => d.Insurance_PlanName == item.Insurance_PlanName)
          if (id == -1) {
            item.Insurance_PlanName = '';
          }
        }
        this.validateData()

      } else {
      }

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
        this.leaveData = response.data.map(item => item.leave_Type.trim());
      } else {
        this.openErrrorSnackBar(response.message);
      }
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
        this.salaryData = response.data.map(item => item.salary_Type.trim());

      } else {
        this.openErrrorSnackBar(response.message);
      }
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
        this.employeeList = response.data;
        for (let item of this.employeeData) {
          let id = this.employeeList.findIndex(d => (d.first_name + ' ' + d.last_name) == item['Reporting Manager'])
          if (id == -1) {
            item['Reporting Manager'] = '';
          }
        }
        this.validateData()
      } else {
      }
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
        this.roleData = response.data;
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));


  }


  // Branch list
  async getBranchList() {
    this.data = undefined;
    this.ngxService.start();

    let branchIds = [];
    this.employeeData.forEach((el: any) => {
       if (el.branch_Id !== '' && el.branch_Id !== null && el.branch_Id !== undefined) {
         branchIds.push(el.branch_Id);
       }
    });
    let uniqueData = Array.from(new Set(branchIds));
    console.log(uniqueData)
    this.branchData = uniqueData

    //Make array as a unique

    // await (this._api.getBranch().subscribe(res => {
    //   this.ngxService.stop();
    //   const response = res;
    //   if (response.success == true) {
    //     this.branchData = response.data
    //     console.log(this.branchData)
    //   } else {
    //   }
    // }, err => {
    //   const error = err.error;
    //   this.ngxService.stop();
    // }));
  }

  // Get Department
  async getDepartment() {
    await (this._api.showDepartment().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.departmentData = response.data.map(item => item.department_Type.trim());
        for (let item of this.employeeData) {
          let id = this.departmentData.findIndex(d => d == item.Department)
          if (id == -1) {
            item.Department = '';
          }
        }
        for (let item of this.employeeData) {
          let id = this.designationData.findIndex(d => d == item.Designation)
          if (id == -1) {
            item.Designation = '';
          }
        }
        this.validateData()

      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
      this.openErrrorSnackBar(error.message);
    }));
  }

  // edit sheet
  async updateSheet() {
    this.ngxService.start();
    await (this._api.uploadEmployeeCsv(this.employeeData, { company_id: JSON.parse(localStorage.getItem('userData')).company_id, ip: '111', user_id: JSON.parse(localStorage.getItem('userData')).user_id }).subscribe(res => {

      const response: any = res;
      this.ngxService.stop();
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.dialogRef.close(JSON.stringify(response));
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  detectChange(e, i, c) {
    this.employeeData[i][c] = e;
    let response = this.employeeData.map((data) => {
      console.log(data)
      console.log((Object.values(data).map(value => value != '')))
      const validation = (Object.values(data).map(value => value != '')).every(v => v === true);
      console.log(validation)
      data['chk'] = validation ? '1' : '0';
      return data
    })
    this.employeeData = response;
    this.validate = (this.employeeData.filter(item => item.chk == 0)).length > 0 ? false : true
    this.emptyCount = (this.employeeData.filter(item => item.chk == 0)).length;
    this.fillCount = (this.employeeData.filter(item => item.chk == 1)).length
  }

  // confirm message
  confirmDialog(): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        console.log(this.employeeData)
        this.employeeData = this.employeeData.filter(item => item.selected == 'uncheck');
        this.validate = (this.employeeData.filter(item => item.chk == 0)).length > 0 ? false : true
        this.emptyCount = (this.employeeData.filter(item => item.chk == 0)).length;
        this.fillCount = (this.employeeData.filter(item => item.chk == 1)).length
      }
    });
  }

  check(i) {
    this.employeeData[i].selected = this.employeeData[i].selected == 'uncheck' ? 'check' : 'uncheck'
    console.log(this.employeeData[i].selected)
  }

  validateData() {
    this.validate = (this.employeeData.filter(item => item.chk == 0)).length > 0 ? false : true
    this.emptyCount = (this.employeeData.filter(item => item.chk == 0)).length;
    this.fillCount = (this.employeeData.filter(item => item.chk == 1)).length
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
