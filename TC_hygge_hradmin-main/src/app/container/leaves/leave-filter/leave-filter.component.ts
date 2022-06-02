import { Component, Inject, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

export interface DialogData {
  leaveFilter: string;
}


@Component({
  selector: 'app-filter',
  templateUrl: './leave-filter.component.html',
  styleUrls: ['./leave-filter.component.scss']
})
export class LeaveFilterComponent implements OnInit {
  formData = {
    companyId: "",
    userId: "",
    employee: "",
    department: "",
    byWhich: { startDate: '', endDate: '' }
  };

  keepOpen = true;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  departmentData: any = [];
  employeeList: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<LeaveFilterComponent>) { }

  ngOnInit(): void {
    this.formData = JSON.parse(this.data.leaveFilter)
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.formData.userId = JSON.parse(localStorage.getItem('userData')).user_id;
    this.getList();
    this.getDepartment();
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

 // Get Department
  async getDepartment() {
    this.ngxService.start();
    await (this._api.showDepartment().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.departmentData = response.data;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  // Filter list
  async filter() {
    this.dialogRef.close(JSON.stringify(this.formData));
  }


}
