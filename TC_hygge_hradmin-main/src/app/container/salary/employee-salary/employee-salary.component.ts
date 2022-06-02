import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { AccessServiceService } from 'src/app/service/access-service.service';
import { PayslipDetailComponent } from '../payslip-detail/payslip-detail.component';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';
import { TableUtil } from '../../../common/tableutil/tableUtil';
@Component({
  selector: 'app-employee-salary',
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss']
})
export class EmployeeSalaryComponent implements OnInit {

  @ViewChild('screen') screen: ElementRef;

  title: string = '';
  // set header column
  displayedColumns: string[] = ['profile_picture', 'first_name', 'department', 'designation', 'salary'];

  //set static data for table
  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([])

  //salByDepartment: any = JSON.stringify({ label: ['Sick leave', 'Paid Leave', 'Emergency leave', 'Unpaid Leave'], percentage: [20, 30, 40, 70], width: 250 });
  salByDepartment: any;
  // salaryByType: any = JSON.stringify({
  //   label: ["Type 1", "Type 2", "Type 3"],
  //   percentage: [20, 10, 50],
  //   width: 250,
  // });
  salaryByType: any;

  // salaryChangeGraphData = JSON.stringify({
  //   label: ['Marketing', 'Accounting'],
  //   percentage: [20, 60],
  //   width: 250,
  //   colors: ['#6863FA'],
  //   height: 250,
  //   mainLabel: ''
  // });
  salaryChangeGraphData: any;

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  data = {
    address: true,
    department: true,
    designation: true,
    passport: true,
    template: true,
    count: 0
  }
  responseData: any = [];
  csvFile: any = '';
  accessPermission: boolean;
  filePath = environment.apiBaseUrl
  graphData: any
  formData = {
    "companyId": "1",
    "isType": ""
  }
  reportData: any = [];
  totalPercent: any;
  percentData: any = [];

  employeesTotalSalary: any = 0;

  //Use for salary employee salary managment table list
  salaryReport: any = [];
  employeeDetail: any = [];
  filterMonth: string = '1month';

  showsalary: boolean = true

  constructor(private sanitizer: DomSanitizer, public _access: AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.filterDataTime(this.filterMonth);
  }


  filterDataTime(e) {
    let from,
      to = moment().format('YYYY-MM-DD');
    switch (e) {
      case '1month':
        from = moment().subtract(1, 'months').format('YYYY-MM-DD');
        break;

      case '6month':
        from = moment().subtract(6, 'months').format('YYYY-MM-DD');

        break;

      case '1year':
        from = moment().subtract(1, 'years').format('YYYY-MM-DD');

        break;

      case '2year':
        from = moment().subtract(2, 'years').format('YYYY-MM-DD');

        break;

      default:
        from = moment().subtract(3, 'years').format('YYYY-MM-DD');

        break;
    }
    this.getSalary(from, to);
    this.salaryDashboard(from, to)
  }

  async getSalary(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
    };
    await this._api.salaryReport(formData).subscribe(
      (res) => {
        const response: any = res;
        if (response.success == true) {
          this.getList(response.data.user_salary_details)
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  async salaryDashboard(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
      page: 1,
      pagination: 10
    }
    await (this._api.salaryDashboard(formData).subscribe((res) => {
      const response: any = res;
      if (response.success == true) {
        this.salaryByType = JSON.stringify({
          label: response.data.salaryByType.map((item) =>
            !item.type ? 'NA' : item.type
          ),
          percentage: response.data.salaryByType.map((item) => item.value),
          width: 250,
        });

        this.salByDepartment = JSON.stringify({
          label: response.data.salaryByDepartment.map((item) =>
            !item.department ? 'NA' : item.department
          ),
          percentage: response.data.salaryByDepartment.map((item) => item.percentage),
          width: 250,
        });

        this.salaryChangeGraphData = JSON.stringify({
          label: response.data.changeSalaryByDepartment.map((item) =>
            !item.department ? 'NA' : item.department
          ),
          percentage: response.data.changeSalaryByDepartment.map((item) => item.changeValue),
          width: 250,
          colors: ['#6863FA'],
          height: 250,
          mainLabel: ''
        });


      } else {
      }
    }, err => {
      const error = err.error
    }));

  }

  // Get Employee List
  async getList(salary: any) {
    await (this._api.getEmployee().subscribe((res) => {
      const response: any = res;
      if (response.success == true) {
        this.employeeDetail = response.data
        response.data.forEach((resdata: any) => {
          salary.forEach((sal: any) => {
            if (resdata.user_id === sal.user_id) {
              resdata["totalsalary"] = sal.totalSalary
            }
          })
        })

        this.employeesTotalSalary = response.data.reduce(function (sum, current) {
          return sum + current.totalsalary;
        }, 0);

        this.csvexcelDataSource = new MatTableDataSource([...response.data]); //dataSource

        this.dataSource = new MatTableDataSource([...response.data]); //dataSource
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log(response.data)
      } else {
      }
    }, err => {
      const error = err.error
    }));
  }

  export() {
    this.ngxService.start();
    // const html = document.getElementById('csvTable');
    const html = document.getElementById('csvTableExp');
    console.log(html);
    let csv = [];
    let rows = html.querySelectorAll('table tr');

    for (let i = 0; i < rows.length; i++) {
      let row = [],
        cols = rows[i].querySelectorAll('td, th');

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].textContent);
      }

      csv.push(row.join(','));
    }

    // Download CSV
    this.download_csv(csv.join('\n'), 'Employee-Salary.csv');
  }

  // Get com[asation] List
  async getComapnsationList() {
    this.ngxService.start();
    await (this._api.compensationTemplate().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
        this.responseData = response.data[0];
        this.data.department = this.responseData.department == 1 ? true : false;
        this.data.designation = this.responseData.designation == 1 ? true : false;
        this.data.passport = this.responseData.passport == 1 ? true : false;
        this.data.address = this.responseData.workLocation == 1 ? true : false;
        this.data.template = this.responseData.templateId == 1 ? true : false;
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  async GenerateReport(e) {
    this.formData.isType = e;
    this.ngxService.start();
    await (this._api.showPaySlipReport(this.formData).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.reportData = response.data;
        for (let item of this.reportData) {
          item.userDetail = JSON.parse(item.userDetail)

          item.userEarning = JSON.parse(item.userEarning)
        }
        console.log(this.reportData)
        setTimeout(() => {
          this.sampleCsv()
        }, 2000)
      } else {
        this.ngxService.stop();
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));
  }


  async showTemplate(tempNo, user_id) {
    let formData = {
      "currentMonth": moment().format('MM'),
      "userID": user_id,
      "isType": "0"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data[0].paySlip_Image)
        const dialogRef = this.dialog.open(PayslipDetailComponent, {
          width: '100%',
          data: {
            img: response.data[0].paySlip_Image
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      console.log(err)
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));



  }

  async downloadSlip(tempNo, user_id) {
    let formData = {
      "currentMonth": moment().format('MM'),
      "userID": user_id,
      "isType": "0"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data[0].paySlip_Image)
        let imageFile;
        let downloadLink;

        // CSV FILE
        imageFile = new Blob([response.data[0].paySlip_Image], { type: 'image/jpg' });

        // Download link
        downloadLink = document.createElement('a');

        // File name
        downloadLink.download = response.data[0].paySlip_Image;

        // We have to create a link to the file
        downloadLink.href = response.data[0].paySlip_Image;

        // Make sure that the link is not displayed
        downloadLink.style.display = 'none';

        // Add the link to your DOM
        document.body.appendChild(downloadLink);

        // Lanzamos
        downloadLink.click();
        this.ngxService.stop();

      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));
  }

  async showDepartmentSalary() {
    this.ngxService.start();
    await (this._api.showDepartmentSalary().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data)
        if (response.data) {
          this.totalPercent = response.total[0];
          this.percentData = response.data;
          let graphdata = { label: [], percentage: [], colors: ['#3F51B5', '#FFAA00', '#F44336', '#C86CE6', '#FF4081', '#15C1DC', '#3F5248', '#FFAB56', '#F44BA2', '#C86AA2', '#FF41BC', '#15C2AC'], width: 200 }
          let count = 0;
          for (let item of this.percentData) {
            graphdata.label.push(item.department)
            let per = Number(item.current)
            graphdata.percentage.push(per)
            item['color'] = graphdata.colors[count]
            count++;
          }
          this.graphData = JSON.stringify(graphdata);
          console.log(this.graphData)
          if (this.percentData.length > 0) {
            // this.getList();
          }
        }
      } else {
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));
  }
  

  exportExcel() {
    // TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }


  // mail pay slip
  async mailPaySlip(user_id) {
    let formData = {
      "currentMonth": moment().format('MM'),
      "userID": user_id,
      "isType": "1"
    }
    this.ngxService.start();
    await (this._api.payslipMail(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message)
      } else {
        console.log(response)
        this.openErrrorSnackBar(response.message)
      }
      console.log(res);
    }, err => {
      const error = err.error;
      console.log(err.error)
      this.openErrrorSnackBar(error.message)
      this.ngxService.stop();
    }));

  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  // Download list in CSV
  sampleCsv() {
    this.ngxService.start();
    const html = document.getElementById('sampleCsv');
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
    this.download_csv(csv.join('\n'), 'SalaryReport.csv');
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

  getDate(d) {
    return moment(d).format('MM/YYYY')
  }

}
