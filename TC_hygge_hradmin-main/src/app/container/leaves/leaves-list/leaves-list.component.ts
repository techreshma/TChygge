import { Component, OnInit, ViewChild } from '@angular/core';
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
import { LeaveFilterComponent } from '../leave-filter/leave-filter.component';
import * as moment from 'moment';
import { ManageLeavesComponent } from '../manage-leaves/manage-leaves.component';
import { LeaveAddComponent } from '../leave-add/leave-add.component';
import { EmployeeLeaveManageComponent } from '../employee-leave-manage/employee-leave-manage.component';
@Component({
  selector: 'app-leaves-list',
  templateUrl: './leaves-list.component.html',
  styleUrls: ['./leaves-list.component.scss']
})
export class LeavesListComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['profile_picture', 'name', 'email', 'department', 'leave_From', 'is_leave', 'action'];
  //displayedColumns: string[] = ['profile_picture', 'name', 'department', 'appliedfor', 'type', 'status','leavebalance', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filePath = environment.apiBaseUrl
  responseData: any = [];
  csvFile: any = '';
  newRequest: any = 0;
  leavePending: any = 0;
  leaveApproved: any = 0;
  month: any = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  accessPermission: boolean;
  formData = {
    "companyId": "",
    "userId": "",
    "employee": "",
    "department": "",
    "byWhich": { "startDate": '', "endDate": '' }
  }


  lineGraphLabel = 'Month'
  buttons: boolean = true;

  //levEmpGraphData: any = JSON.stringify({ label: ['Sick leave', 'Paid Leave', 'Emergency leave', 'Unpaid Leave'], percentage: [20, 30, 40, 70], width: 250 });
  levEmpGraphData: any;
  //levEmpLineGraphData = JSON.stringify({ label: ['Sales', 'Designing', 'Marketing', 'Production', 'Hr'], percentage: [10, 50, 30, 75, 80], colors: ['#ff9b44'], height: 250, mainLabel: this.lineGraphLabel })
  levEmpLineGraphData: any;
  //levTypeGraphData = JSON.stringify({ label: ['Sick leave', 'Paid Leave', 'Emergency leave', 'Unpaid Leave'], percentage: [20, 30, 40, 70], colors: ['#0190FF'], height: 250, mainLabel: '' })
  levTypeGraphData: any;

  currentMonth: any = moment().format('MM')
  //Title
  leaveCurrentMonthTitle: any = 'Type of Leaves taken in ' + this.month[this.currentMonth - 1];
  leaveByDepartmentTitle: any = 'Total Leaves by Department in ' + this.month[this.currentMonth - 1]
  leaveByTypeTitle: any = 'Total Leaves by Type in ' + this.month[this.currentMonth - 1]

  constructor(
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formData.companyId = JSON.parse(localStorage.getItem('userData')).company_id;
    //getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
    this.getLeaveDashboardGraph();
  }

  async getLeaveDashboardGraph() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };

    await (this._api.leaveDashboardGraph(formData).subscribe(res => {
      const response: any = res
      if (response.success === true) {
        this.leaveApproved = response.data.leave_employeeToday ? response.data.leave_employeeToday : 0

        //leave_employeeToday
        this.levEmpGraphData = JSON.stringify({
          label: response.data.leaves_takenMonth.map((item) =>
            !item.leave_Name ? 'NA' : item.leave_Name
          ),
          percentage: response.data.leaves_takenMonth.map((item) => item.count),
          width: 250,
        });

        this.levTypeGraphData = JSON.stringify({
          label: response.data.total_LeavesType.map((item) =>
            !item.leave_Name ? 'NA' : item.leave_Name
          ),
          percentage: response.data.leaves_takenMonth.map((item) => item.count),
          colors: ['#0190FF'],
          height: 250,
          mainLabel: ''
        });

        this.levEmpLineGraphData = JSON.stringify({
          label: response.data.total_LeavesDepartment.map((item) =>
            !item.department ? 'NA' : item.department),
          percentage: response.data.total_LeavesDepartment.map((item) =>
            item.count.data.reduce((sum, x) => sum + x)
          ),
          colors: ['#ff9b44'],
          height: 250,
          mainLabel: this.lineGraphLabel
        })
      }
      else { }
    }, err => {
      const error = err.error
    }))
  }

  // Get Leave List
  async getList() {
    this.ngxService.start();
    if (this.formData.byWhich.startDate != '') {
      this.formData.byWhich = { startDate: moment(this.formData.byWhich.startDate).format('YYYY-MM-DD'), endDate: moment(this.formData.byWhich.endDate).format('YYYY-MM-DD') }
    }
    await (this._api.getLeave(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        let pendingLeave: any = 0;

        this.responseData = response.data;
        this.newRequest = 0;

        this.responseData.forEach((element: any) => {
          if (element.isActive === '0') {
            this.responseData.splice(this.responseData.indexOf(element), 1);
          }
        })

        this.responseData.forEach((el: any) => {
          if (el.is_leave == 0) {
            pendingLeave++
          }
        })

        this.leavePending = pendingLeave;
        this.dataSource = new MatTableDataSource([...this.responseData]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  // open filter modal
  openManageLeaveModal(id, leaveBalance) {
    const dialogRef = this.dialog.open(EmployeeLeaveManageComponent, {
      width: '50%',
      data: {
        userId: id,
        leaveBalance: JSON.stringify(leaveBalance)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }

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

  async deleteEmployee(id) {
    this.ngxService.start();
    let formData = {
      leaveTypeId: id,
      ip_Address: "12.33.22.22",
      company_id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await this._api.deleteLeave(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.openSnackBar(response.message);
          this.getList();
          this.getLeaveDashboardGraph();
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



  // open filter modal
  openAddLeaveModal() {
    const dialogRef = this.dialog.open(LeaveAddComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }

  // open filter modal
  openFilterModal() {
    const dialogRef = this.dialog.open(LeaveFilterComponent, {
      width: '50%',
      data: {
        leaveFilter: JSON.stringify(this.formData)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.formData = JSON.parse(result);
      this.filterTable(this.formData)
    });
  }

  filterTable(data: any) {
    let filterArray: any = []
    this.responseData.forEach((el: any) => {
      let byAll = el.department === data.department && el.user_Id === data.employee && el.leave_From === data.byWhich.start && el.leave_To === data.byWhich.end;
      let depUsrId = el.department === data.department && el.user_Id === data.employee;
      let leaveTime = el.leave_From === data.byWhich.start && el.leave_To === data.byWhich.end;
      let dep = el.department === data.department;
      let userId = el.user_Id === data.employee;

      let finalFilter = byAll || depUsrId || dep || userId || leaveTime
      if (finalFilter) {
        console.log(el)
        filterArray.push(el)
      }
    })

    console.log(filterArray)

    this.dataSource = new MatTableDataSource([...filterArray]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // open modify leave modal
  openModifyModal(e) {
    const dialogRef = this.dialog.open(ManageLeavesComponent, {
      width: '50%',
      data: {
        leaveData: JSON.stringify(e)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
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
  // date formating
  formatDate(date) {
    return moment(date).format('DD-MM-YYYY')
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
    this.download_csv(csv.join('\n'), 'Leave-List.csv');
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
