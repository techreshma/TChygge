import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  userComapanyChart: string = JSON.stringify({ label: ["Plan1", "Plan2", "Plan3"], percentage: [{ name: 'Company', data: [10, 50, 30, 75, 80] }, { name: 'User', data: [30, 70, 20, 95, 10] }], colors: ['#0190FF', '#ff9b44'], height: 250, seriesType: true });
  bgWhite: boolean = false;

  //#region Company Dashboard
  planCompanyChart: any;
  userActivesChart: any;
  userPlatformChart: any;
  userGenderChart: any;
  numberOfUsersEnrolled: any;
  noOfCompanyBasedOnPlan: any;
  userBasedOnPlatform: any;
  totalNumberOfCompany: any;
  //#endregion

  heightRecord: any = {
    isDefault: true,
    dasboard1: 'dashboard_card',
    dasboard2: 'dashboard_radar',
    dasboard3: 'dashboard_gauage',
    dasboard4: 'dashboard_maxline ',
    dasboard5: 'dashboard_donut',
    dasboard6: 'dashboard_line',
    dasboard7: 'dashboard_heatmap'
  }

  // set header column
  displayedColumns: string[] = ['plan', 'company_Name', 'plan_Name', 'company_BusinessType', 'status', 'action'];
  // set static data for table
  dataSource = new MatTableDataSource([]);
  // table sorting and pagination
  responseData: any = [];
  imgPath = environment.apiBaseUrl;
  accessPermission: boolean;
  constructor(public router: Router, public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
    this.companyReportDetail();
  }


  async companyReportDetail() {
    await (this._api.companyReportDetail().subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.numberOfUsersEnrolled = response.data.total_user;
        this.totalNumberOfCompany = response.data.total_companies;

        let companyBasedPlan: any = [];
        let companyBasedPlanKeys: any = Object.keys(response.data.companiesBased_plan);
        let companyBasedPlanValues: any = Object.values(response.data.companiesBased_plan);
        companyBasedPlanKeys.forEach((keys: any, index: any) => {
          companyBasedPlan.push({ planname: keys, value: companyBasedPlanValues[index] })
        })

        this.noOfCompanyBasedOnPlan = JSON.stringify({
          label: companyBasedPlan.map((item) => item.planname),
          percentage: companyBasedPlan.map((item) => item.value),
          colors: ['#15C1DC', '#FF6384'],
        })

        this.userPlatformChart = JSON.stringify({
          label: response.data.user_usage.map((item) => item.Platform),
          percentage: response.data.user_usage.map((item) => item.value),
          colors: ['#15C1DC', '#FF6384'],
        })


        this.userGenderChart = JSON.stringify({
          label: response.data.user_gender.map((item) => item.gender),
          percentage: response.data.user_gender.map((item) => item.employee),
          colors: ['#15C1DC', '#FF6384'],
        })

        this.userActivesChart = JSON.stringify(
          {
            label: response.data.activeUser_count.map((item) => item.month),
            percentage: response.data.activeUser_count.map((item) => item.value),
            colors: ['#FF4081'],
            height: 250,
          }
        );

        //Calculate the data according to planCompanyChart
        let plansArray: any = [];
        let businessTypes: any = [];
        response.data.planTypeBased_companySize.forEach((item: any) => {
          plansArray.push(item.plan_Name);
          businessTypes.push(item.company_BusinessType);
        })
        plansArray = [...new Set(plansArray)] // Get unique data of planArray
        businessTypes = [...new Set(businessTypes)] // Get unique data of businessType

        console.log(plansArray)
        console.log(businessTypes)
        //Calculate the data according to planCompanyChart

        this.planCompanyChart = JSON.stringify(
          {
            label: response.data.planTypeBased_companySize.map((item) => item.month),
            percentage: response.data.planTypeBased_companySize.map((item) => item.value),
            colors: ['#FF4081']
          }
        );

        //planTypeBased_companySize 

      }
    }, err => {
      const error = err.error;
      console.log(error)
      this.ngxService.stop();
    }))
  }


  // Get Company List
  async getList() {
    this.ngxService.start();
    await (this._api.getCompany().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {

        //Check Expiration Start
        response.data.forEach((el: any) => {
          console.log("End Date", el.plan_EndDate)
        })
        //Check Expiration End

        for (let item of response.data) {
          item.P_Contact = item.P_Contact == '' ? [{ contact: null }] : JSON.parse(item.P_Contact);
        }
        this.responseData = response.data;
        this.responseData.forEach((el: any) => {
           console.log(el.PC_Email)
        })
        this.dataSource = new MatTableDataSource([...this.responseData]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // Delete Company
  async deleteCompany(id) {
    this.ngxService.start();
    const formData = {
      company_id: id,
      ip_Address: '123.432.222'
    };
    await (this._api.deleteCompany(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  // Update Company status
  async statusCompany(id, status) {
    this.ngxService.start();
    const formData = {
      ip_Address: '123.321.22',
      status,
      company_id: id
    };
    await (this._api.statusCompany(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }


      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));

  }


  // Send invatiation to company
  async sendInvite(id) {
    this.ngxService.start();
    const formData = {
      ip_Address: '123.321.22',
      companyId: id
    };
    await (this._api.companyInvite(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }


      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));

  }


  // Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //break address
  getAddressBreak(e, n) {
    let add = e.split(',')
    //return add[n].trim()
    return '';
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

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCompany(id);
      }
      else {
        this.getList()
      }
    });
  }

  // Check day is negative or positive
  getNegative(number) {
    // console.log(Math.sign(number))
    return Math.sign(number);

  }
  //get Positive
  getPositive(number) {
    return number * -1;
  }

  // Download list in CSV
  export_table_to_csv() {
    this.ngxService.start();
    const html = document.getElementById('csvTable');
    let csv = [];
    let rows = html.querySelectorAll('table tr');

    for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll('td, th');

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].textContent);
      }

      csv.push(row.join(','));
    }

    // Download CSV
    this.download_csv(csv.join('\n'), 'Company-List.csv');
  }

  download_csv(csv, filename) {
    let csvFile;
    let downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], { type: 'text/csv' });

    // Download link
    downloadLink = document.createElement('a');

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none';

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
    this.ngxService.stop();
  }

}
