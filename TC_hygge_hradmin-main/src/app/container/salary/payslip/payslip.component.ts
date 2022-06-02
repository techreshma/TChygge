import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent implements OnInit {
  payslipNo: any = '';
  constructor(public _access: AccessServiceService,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getSelectedPayslip();
  }

  // Get getSelectedPayslip
  async getSelectedPayslip() {
    this.ngxService.start();
    let data = {
      "isType": "1",
      "companyId": JSON.parse(localStorage.getItem('userData')).company_id,
      "salary_TemplateID": "0"
    }
    await (this._api.showPaySliptemplate(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data)
        this.payslipNo = response.data;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  async selectPayslip(e) {
    this.payslipNo = e.value;
    console.log(this.payslipNo)
    this.ngxService.start();
    let data = {
      "isType": "0",
      "companyId": JSON.parse(localStorage.getItem('userData')).company_id,
      "salary_TemplateID": e.value
    }
    await (this._api.showPaySliptemplate(data).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
      } else {
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
