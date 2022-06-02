import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { PayslipDetailComponent } from '../payslip-detail/payslip-detail.component';


@Component({
  selector: 'app-payslip-edit',
  templateUrl: './payslip-edit.component.html',
  styleUrls: ['./payslip-edit.component.scss']
})
export class PayslipEditComponent implements OnInit {
  data = {
    address: true,
    department: true,
    designation: true,
    passport: true,
    template: true,
    count: 0
  }
  responseData: any;
  tempNo: number;
  showAll = true
  constructor(public router: Router, public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
    this.tempNo = parseInt(this.router.url.split('/').pop());
  }

  ngOnInit(): void {
    this.getList();
  }

  // Get Sub Admin List
  async getList() {
    this.ngxService.start();
    await (this._api.compensationTemplate().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.data.count = this.tempNo - 1;
        this.responseData = response.data[0];
        console.log("Set response for checkbox" , this.responseData)
        this.data.department = this.responseData.department == 1 ? true : false;
        this.data.designation = this.responseData.designation == 1 ? true : false;
        this.data.passport = this.responseData.passport == 1 ? true : false;
        this.data.address = this.responseData.workLocation == 1 ? true : false;
        this.data.template = this.responseData.templateId == 1 ? true : false;
      } else {
      }
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // edit payslip detail
  async editPaySlip() {
    let payload = {
      "compensationId": this.responseData.compensation_id,
      "department": this.data.department ? 1 : 0,
      "designation": this.data.designation ? 1 : 0,
      "passport": this.data.passport ? 1 : 0,
      "workLocation": this.data.address ? 1 : 0,
      "templateId": this.data.template ? 1 : 0,
      "ip_Address": "12346"
    }

    console.log("Set template checkbox ", payload)
    this.ngxService.start();
    await (this._api.editCompensationTemplate(payload).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message)
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error)
      this.ngxService.stop();
    }));

  }


  showTemplate(tempNo) {
    this.showAll = false
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
