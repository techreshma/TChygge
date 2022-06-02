import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { EmployeeAddComponent } from '../employee-add/employee-add.component';
import {
  ConfirmBoxComponent,
  ConfirmDialogModel,
} from 'src/app/confirm-box/confirm-box.component';
import { CsvUploadComponent } from '../csv-upload/csv-upload.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { FilterComponent } from '../filter/filter.component';
import { Router } from '@angular/router';
import { CsvDataComponent } from '../csv-data/csv-data.component';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  // set header column
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'designation',
    'status',
    'action',
  ];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    reporting_Manager: '',
    department: '',
    insurance_plan_name: '',
    working_HoursTo: '',
    working_HoursFrom: '',
    role: 0,
    designation: '',
  };

  leaveBalance = [];
  salaryBalance = [];
  responseData: any = [];
  csvFile: any = '';
  accessPermission: boolean;

  depEmpGraphData: any;
  genEmpGraphData: any;
  ageEmpGraphData: any;
  newemployeeGraphData: any;
  averageworkingGraphData: any;


  totalEmployee: any = 0;
  lateEmployee: any = 0;
  lateEmployeeToday: any = 0;

  totalLicense: any = 0;
  remainLicense: any = 0;

  constructor(
    public router: Router,
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    //getting access permission
    this.accessPermission = this._access.getRouteAccess(
      'User roles',
      JSON.parse(localStorage.getItem('userData')).moduleAccess
    );
    this.getList();
    this.getSampleCsv();
    this.loadEmployeeDashboard();

    //Call Licence detail
    this.getLicenceDetail();
  }

  getLicenceDetail() {
    let userData = localStorage.getItem('userData');
    let record = JSON.parse(userData);
    this.totalLicense = record.license_total;
    this.remainLicense = record.license
  }

  // Get Employee List
  async getList() {
    this.ngxService.start();
    await this._api.getEmployee().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        console.log(response)
        if (response.success == true) {
          const arr = [];
          for (const item of response.data) {
            item['salarys'] = [];
            item['leaves'] = [];
            let sal = JSON.parse(item.salaryBalance);
            item.gender = !item.gender ? 'male' : item.gender;
            if (sal != null) {
              for (let i = 0; i < sal.length; i++) {
                for (var key in sal[i]) {
                  item.salarys.push({ label: key, value: sal[i][key] });
                }
              }
            }

            let lea = JSON.parse(item.leaveBalance);
            if (lea != null) {
              for (let i = 0; i < lea.length; i++) {
                for (var key in lea[i]) {
                  item.leaves.push({ label: key, value: lea[i][key] });
                }
              }
            }

            const obj = {
              position: `${environment.apiBaseUrl}${item.profile_picture}`,
              name:
                (item.first_name ? item.first_name : '') +
                ' ' +
                (item.last_name ? item.last_name : ''),
              email: item.email,
              designation: item.designation,
              status: item.status,
              id: item.user_id,
              role: item.role,
              user_id: item.user_id,
            };
            arr.push(obj);
          }

          this.responseData = response.data;
          this.dataSource = new MatTableDataSource([...arr]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.leaveBalance = this.responseData[0].leaves;
          // this.salaryBalance = this.responseData[0].salarys
        } else {
        }
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  //showCompanyByID

  async loadEmployeeDashboard() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    this.ngxService.start();
    await this._api.employeeGraphDetail(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        let response: any = res;
        if (response.success) {
          console.log('Employee dashboard', response.data);
          let responseData = response.data;
          this.totalEmployee = responseData.total_employee;
          this.lateEmployee = responseData.leave_employeeToday;
          this.lateEmployeeToday = responseData.late_employeeToday;

          let departmentCount = this.countArray(response.data.department);
          let genderCount = this.countGender(response.data.gender);
          let ageCount = this.countAge(response.data.age_average);
          let newempCount = this.countnewEmployee(response.data.new_employee);
          let averageemployeeCount = this.countaverageEmployee(response.data.averageworkhour_department);


          this.depEmpGraphData = JSON.stringify({
            label: departmentCount.map((item) => item.department) || [],
            percentage: departmentCount.map((item) => item.count) || [],
            width: 250,

          });

          this.genEmpGraphData = JSON.stringify({
            label: genderCount.map((item) => item.gender),
            percentage: genderCount.map((item) => item.count),
            width: 250,
          });

          this.ageEmpGraphData = JSON.stringify({
            label: ageCount.map((item) => item.ageKey),
            percentage: ageCount.map((item) => item.ageEmp),
            width: 250,
          });

          this.newemployeeGraphData = JSON.stringify({
            label: newempCount.map((item) => item.month),
            percentage: newempCount.map((item) => item.value),
            width: 250,
            colors: ['#ff9b44'],
            height: 250,
            mainLabel: ''
          });

          this.averageworkingGraphData = JSON.stringify({
            label: averageemployeeCount.map((item) => item.department),
            percentage: averageemployeeCount.map((item) => item.value),
            width: 250,
            colors: ['#6863FA'],
            height: 250,
            mainLabel: ''
          });
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  // Delete Employee
  async deleteEmployee(id) {
    this.ngxService.start();
    let formData = {
      user_id: id,
      company_id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this._api.deleteEmployee(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
        } else {
          this.openErrrorSnackBar(response.message);

          this.getList();
        }

        console.log(res);
      },
      (err) => {
        this.getList();
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // Update Employee status
  async updateEmployeeStatus(id, status) {
    this.ngxService.start();
    let formData = {
      user_id: id,
      status: status,
      company_id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this._api.updateEmployeeStatus(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // Get sample csv
  async getSampleCsv() {
    this.ngxService.start();
    await this._api.getSampleCsv().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          // this.openSnackBar(response.message);
          this.csvFile = response.data;
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // send invitation link to employee
  async invitationLink(id) {
    this.ngxService.start();
    let formData = {
      user_id: id,
      company_id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this._api.invitationLink(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
        } else {
          this.openErrrorSnackBar(response.message);
        }

        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }
    );
  }

  // open add Employee modal
  openSubAddModal() {
    const dialogRef = this.dialog.open(EmployeeAddComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getList();
    });
  }

  // open filter modal
  openfilterModal() {
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getList();
    });
  }

  // open add Employee modal
  openSubEditModal(e) {
    let data = this.responseData.filter((item) => e.id == item.user_id);
    const dialogRef = this.dialog.open(EmployeeEditComponent, {
      width: '50%',
      data: {
        employee: JSON.stringify(data[0]),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getList();
    });
  }

  uploadCsv() {
    const dialogRef = this.dialog.open(CsvUploadComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.openCsvDataModal(result);
    });
  }

  // open csvData view
  openCsvDataModal(res) {
    const dialogRef = this.dialog.open(CsvDataComponent, {
      width: '100%',
      data: {
        employee: res,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getList();
    });
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
      panelClass: ['success-alert'],
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert'],
    });
  }

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.deleteEmployee(id);
      }
    });
  }

  // Download list in CSV
  export_table_to_csv() {
    this.ngxService.start();
    const html = document.getElementById('csvTable');
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
    this.download_csv(csv.join('\n'), 'Employee-List.csv');
  }

  // Download list in CSV
  sampleCsv() {
    this.ngxService.start();
    const html = document.getElementById('sampleCsv');
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
    this.download_csv(csv.join('\n'), 'Sample.csv');
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

  countArray(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].department == (copy[w] && copy[w].department)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          department: original[i].department,
          count: original[i].employee,
        };
        compressed.push(a);
      }
    }

    return compressed;
  }

  countGender(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].gender == (copy[w] && copy[w].gender)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          gender: original[i].gender ? original[i].gender : 'Male',
          count: original[i].employee,
        };
        compressed.push(a);
      }
    }

    return compressed;
  }

  countAge(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].ageKey == (copy[w] && copy[w].ageKey)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          ageKey: original[i].ageKey,
          ageEmp: original[i].ageEmp,
        };
        compressed.push(a);
      }
    }

    return compressed;
  }

  countnewEmployee(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].month == (copy[w] && copy[w].month)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          month: original[i].month,
          value: original[i].value,
        };
        compressed.push(a);
      }
    }


    return compressed;
  }

  countaverageEmployee(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);
    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (original[i].department == (copy[w] && copy[w].department)) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }

      if (myCount > 0) {
        let a = {
          department: original[i].department,
          value: original[i].value,
        };
        compressed.push(a);
      }
    }


    return compressed;
  }
}
