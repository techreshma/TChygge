import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { PopupmodalComponent } from '../../../component/popupmodal/popupmodal.component';
import { SharedService } from 'src/app/service/shared.service';
// import { employeeFilterArray } from '../../../constant/filterreport/employee';
import { element } from 'protractor';

import * as moment from 'moment'
// import { extendMoment } from "moment-range";

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EventSettingsModel, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { Router } from '@angular/router';

export interface ModuleName {
  name: string,
  value: string
}

@Component({
  selector: 'app-sa-users',
  templateUrl: './sa-users.component.html',
  styleUrls: ['./sa-users.component.scss']
})

export class SaUsersComponent implements OnInit {

  title = 'htmltopdf';
  displayedColumns: string[] = [];
  dataSource: any = new MatTableDataSource([]);
  csvexcelDataSource: any = new MatTableDataSource([]);
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumnsTitleDemo: any[] = [
    { title: 'User Id', chk: true, value: 'userId' },
    { title: 'Age', chk: true, value: 'age' },
    { title: 'Average Duration Per Login', chk: true, value: 'averageDurationPerlogin' },
    { title: 'Average Login Per Month', chk: true, value: 'averageLoginPermonth' },
    { title: 'Company', chk: true, value: 'company' },
    { title: 'Gender', chk: true, value: 'gender' },
    { title: 'Home Location', chk: true, value: 'homeLocation' },
    { title: 'Last Login', chk: true, value: 'lastLogin' },
    { title: 'Last Thirty Days Login', chk: true, value: 'lastThirtyDaysLogin' },
    { title: 'Nationality', chk: true, value: 'nationality' },
    { title: 'Platform', chk: true, value: 'platform' },
    { title: 'Total Life Time Duration Used', chk: true, value: 'totalLifetimeDurationUsed' },
    { title: 'Work Location', chk: true, value: 'workLocation' },
  ];

  data: any = [];
  userBasedOnCn: any = 'company';
  userBasedOnGam: any = 'gender'
  ageBasedOn: any = 'average'

  filterDataType: any = {
    reporttype: 'Employee',
  };
  filteredRecordData: any = [];
  departmentList: any = [];
  recoverFilter: any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  modulename: ModuleName[] = [];
  tableRecord: any = [];
  userGenderChart: string = JSON.stringify({ label: ['Male', 'Female'], percentage: [60, 40], colors: ['#15C1DC', '#FFAA27', '#F44336', '#F44350'] });
  userMaritialStatusChart: string = JSON.stringify({ label: ['Single', 'Married', 'Divorce'], percentage: [60, 40, 20], colors: ['#15C1DC', '#FFAA27', '#F44336', '#F44350'] });
  userAgeChart: string = JSON.stringify({ label: ['18-30', '31-60'], percentage: [60, 40], colors: ['#15C1DC', '#FFAA27', '#F44336', '#F44350'] });
  filterTimeOption: any = [
    {
      type: 'Today',
      number: 1,
    },
    {
      type: 'Yesterday',
      number: 2,
    },
    {
      type: 'Last 7 days',
      number: 3,
    },
    {
      type: 'Last 30 days',
      number: 4,
    },
    {
      type: 'Last Month',
      number: 5,
    },
    {
      type: 'This Month',
      number: 6,
    },
    {
      type: 'This Year',
      number: 7,
    },
  ]


  total_users: any;
  genderGraphData: any; //Array
  companyGraphData: any; //Array
  age_average: number;
  averageAgeCriteriaGraphData: any; //Array 
  nationaltyGraphData: any; //Array
  maritalGraphData: any; //Array
  userOnPlatformsGraphData: any; //Array 
  workLocationsGraphData: any; //Array
  average_login_count: any;
  homeLocationGraphData: any; //Array



  total_usage_duration: any;
  login_counts: any;
  average_usage_duration: any;

  ageRange: any = true;


  //User for customization
  customizeData: any = [
    "userId",
    "age",
    "averageDurationPerlogin",
    "averageLoginPermonth",
    "company",
    "gender",
    "homeLocation",
    "lastLogin",
    "lastThirtyDaysLogin",
    "nationality",
    "platform",
    "totalLifetimeDurationUsed",
    "workLocation",
  ];

  constructor(
    public api: CommonServiceService,
    public _snackBar: MatSnackBar,
    public ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    public sharedService: SharedService
  ) { }


  ngOnInit(): void {
    this.loadService();
    this.getDisplayedColumns();
    this.getUserReport();
    this.monthlyAverageAndDuration();
  }


  //Get User Report
  async getUserReport() {
    this.ngxService.start();
    await this.api.employeeReport().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.total_users = response.data.total_users;
          this.genderGraphData = JSON.stringify({
            label: response.data.gender.map((item) => item.gender),
            percentage: response.data.gender.map((item) => item.employee),
            colors: ['#15C1DC', '#FF6384']
          })

          this.companyGraphData = JSON.stringify({
            label: response.data.company.map((item) => item.comapny_name),
            percentage: response.data.company.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384']
          })

          this.age_average = response.data.age_average;
          this.averageAgeCriteriaGraphData = JSON.stringify({
            label: response.data.average_ageCriteria.map((item) => item.ageKey),
            percentage: response.data.average_ageCriteria.map((item) => item.ageEmp),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          response.data.nationalty.forEach((el: any) => {
            el.nationality = el.nationality === null ? 'Not Mention' : el.nationality;
          })

          this.nationaltyGraphData = JSON.stringify({
            label: response.data.nationalty.map((item) => item.nationality),
            percentage: response.data.nationalty.map((item) => item.employee),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          response.data.marital.forEach((el: any) => {
            el.marital_Status = el.marital_Status === null ? 'Not Mention' : el.marital_Status;
          })

          this.maritalGraphData = JSON.stringify({
            label: response.data.marital.map((item) => item.marital_Status),
            percentage: response.data.marital.map((item) => item.employee),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          response.data.user_on_platforms.forEach((el: any) => {
            el.user_count = parseInt(el.user_count)
          })

          this.userOnPlatformsGraphData = JSON.stringify({
            label: response.data.user_on_platforms.map((item) => item.device_name),
            percentage: response.data.user_on_platforms.map((item) => item.user_count),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          response.data.work_locations.forEach((el: any) => {
            el.location_name = el.location_name === null ? 'Not Mention' : el.location_name;
          })

          this.workLocationsGraphData = JSON.stringify({
            label: response.data.work_locations.map((item) => item.location_name),
            percentage: response.data.work_locations.map((item) => item.users_count),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          response.data.home_location.forEach((el: any) => {
            el.location_name = el.location_name === null ? 'Not Mention' : el.location_name;
          })

          this.homeLocationGraphData = JSON.stringify({
            label: response.data.home_location.map((item) => item.location_name),
            percentage: response.data.home_location.map((item) => item.users_count),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })


          //Restrict below 18 age user
          let tableArray:any = [];
          response.data.user_report_detail.forEach((el: any, index: any) => {
            if (el.age >= 18) {
              tableArray.push(el)
            }
          })

          this.csvexcelDataSource = new MatTableDataSource([...tableArray]);
          this.csvexcelDataSource.sort = this.sort;

          this.dataSource = new MatTableDataSource([...tableArray]); //dataSource
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  async monthlyAverageAndDuration() {
    this.ngxService.start();
    await this.api.monthlyAverageAndDuration().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          response.data
          
          this.average_login_count = response.data.loginAverageCount;
          this.login_counts = response.data.loginCount;
          console.log(this.login_counts)
          this.average_usage_duration = response.data.totalAverage;
          this.total_usage_duration = response.data.totalDuration;
        }
      })
  }


  userBasedOnCnFun(mode: any) {
    this.userBasedOnCn = mode;
  }

  userBasedOnGamFun(mode: any) {
    this.userBasedOnGam = mode;
  }

  downloadAsPDF() {
    const doc = new jsPDF();
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
      Helvetica: {
        normal: 'Helvetica-Regular.ttf',
        bold: 'Helvetica-Medium.ttf',
        italics: 'Helvetica-Italic.ttf',
        bolditalics: 'Helvetica-MediumItalic.ttf',
      },
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getDesignation(data: any) {
    let designation = [];
    data.forEach((el: any) => {
      if (el.designation !== '' && el.designation !== null) {
        designation.push(el.designation);
      }
    });
    //Make array as a unique
    let uniqueData = Array.from(new Set(designation));
    let designation_data = [];
    uniqueData.forEach((dep_el: any) => {
      designation_data.push({ title: dep_el, value: dep_el });
    });
    // employeeFilterArray['data'].forEach((els: any) => {
    //   if (els.value === 'designation') {
    //     els['childFilter'] = designation_data;
    //   }
    // });
  }

  getReportingManager(data: any) {
    //reporting_Manager
    let reportingmanager = [];
    data.forEach((el: any) => {
      if (el.reporting_Manager !== '' && el.reporting_Manager !== null) {
        reportingmanager.push(el.reporting_Manager);
      }
    });

    let uniqueData = Array.from(new Set(reportingmanager));
    let reportingmanager_data = [];
    uniqueData.forEach((rm_el: any) => {
      reportingmanager_data.push({ title: rm_el, value: rm_el });
    });
    // employeeFilterArray['data'].forEach((els: any) => {
    //   if (els.value === 'reporting_Manager') {
    //     els['childFilter'] = reportingmanager_data;
    //   }
    // });
  }

  add(data): void {

    // Add our fruit
    this.modulename.push(data);

  }

  remove(modulename: ModuleName): void {
    let modArr: any = modulename
    const index = this.modulename.indexOf(modulename);

    if (index >= 0) {
      this.modulename.splice(index, 1);
    }

    if (this.modulename.length === 0) {
      this.resetFilter()
    }
  }



  //loadService
  loadService() {
    // this.sharedService.modalfilterService.subscribe((el: any) => {
    //   let check = el.report_type == 'employee';
    //   if (check) {
    //     el.isReset
    //       ? this.resetFilter()
    //       : this.fetchFilterFunction(el.module_keyname, el.module_childarray);
    //   }
    // });
  }

  resetFilter() {
    this.data = this.tableRecord;
    this.dataSource = new MatTableDataSource([...this.data]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns);
  }


  exportExcel() {
    TableUtil.exportTableToExcel('csvTableExp','User Report');
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //#region  Filter modal function
  openFilterModal() {
    // this.dialog.open(PopupmodalComponent, {
    //   width: '50em',
    // });
    // employeeFilterArray['filterArray'] = [];
    // this.sharedService.reportFilterFunction(employeeFilterArray);
  }
  //#endregion

  //#region  Filter fetch function
  /*
    key : String
    values : Array
  */
  fetchFilterFunction(key: any, values: any) {
    this.filteredRecordData = [];
    this.modulename = [];
    let elementArray: boolean = true

    //Use for mat-chip
    values.forEach((el: any) => {

      if (el.start) {
        this.modulename.push({
          name: key,
          value: el.start + ' - ' + el.end,
        })
      }
      if (el.filtertype) {
        this.modulename.push({
          name: key,
          value: el.filtertype,
        })
      }
      if ((!el.filtertype) || (!el.start)) {
        this.modulename.push({
          name: key,
          value: el,
        })
      }

      if (el.start) {
        elementArray = false;
        this.calculateAgeRange(el)
      }

      if (el.filtertype) {
        elementArray = false;
        this.filterTime(el)
      }

    })

    if (elementArray) {
      this.tableRecord.forEach((element) => {
        values.forEach((val) => {
          var name: any = "";
          if (key === 'name') {
            name = element.first_name + " " + element.last_name;
          }
          if (element[key] === val || name === val) {
            this.filteredRecordData.push(element);
          }
        });
      });

      this.dataSource = new MatTableDataSource([...this.filteredRecordData]); //dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.csvexcelDataSource.sort = this.sort;
    }

  }
  //#endregion

  filterTime(timefilter: any) {
    this.filteredRecordData = [];

    let currentdate = moment().format("YYYY-MM-DD");
    let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    let before7Days = moment().subtract(7, "days").format("YYYY-MM-DD");
    let before30Days = moment().subtract(30, "days").format("YYYY-MM-DD");
    let lastMonth = moment().subtract(1, "months").format("MM");
    let currentMonth = moment(currentdate).format('MM');
    let currentYear = moment(currentdate).format('YYYY');


    this.tableRecord.forEach((el: any) => {
      if (el.employee_joiningDate !== null && el.employee_joiningDate !== '') {
        let employee_joining = moment(el.employee_joiningDate).format('YYYY-MM-DD')
        if (employee_joining !== 'Invalid date')
          switch (timefilter.filtertype) {
            case 1:
              if (employee_joining === currentdate) {
                this.filteredRecordData.push(el)
              }
              return
            case 2:
              if (employee_joining === yesterday) {
                this.filteredRecordData.push(el)
              }
              return
            case 3:
              if (employee_joining >= currentdate && employee_joining <= before7Days) {
                this.filteredRecordData.push(el);
              }
              return
            case 4:
              if (employee_joining >= currentdate && employee_joining <= before30Days) {
                this.filteredRecordData.push(el);
              }
              return
            case 5:
              if (lastMonth === moment(employee_joining).format('MM')) {
                this.filteredRecordData.push(el);
              }
              return
            case 6:
              console.log(currentMonth, moment(employee_joining).format('MM'))
              if (currentMonth === moment(employee_joining).format('MM')) {
                this.filteredRecordData.push(el)
              }
              return
            case 7:
              console.log(currentYear, moment(employee_joining).format('YYYY'))
              if (currentYear === moment(employee_joining).format('YYYY')) {
                this.filteredRecordData.push(el)
              }
              return
          }
      }
    })

    console.log(this.filteredRecordData)
    this.dataSource = new MatTableDataSource([...this.filteredRecordData]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  calculateAgeRange(rangeobj: any) {
    this.filteredRecordData = [];
    var subStart: any = moment().subtract(rangeobj.start, "years").format("YYYY-MM-DD");
    var subEnd: any = rangeobj.end ? moment().subtract(rangeobj.end, "years").format("YYYY-MM-DD") : '';

    this.tableRecord.forEach((element: any) => {
      if (element.DOB !== null) {
        if (moment(element.DOB).isBetween(subEnd, subStart)) {
          this.filteredRecordData.push(element);
        }
      }
    })

    console.log(this.filterDataType)
    this.dataSource = new MatTableDataSource([...this.filteredRecordData]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  addRemoveColumn(e) {
    console.log(e);
    let arr = [];
    const found = this.displayedColumnsTitleDemo.map((r) => {
      if (e.indexOf(r.value) >= 0) {
        r.chk = true;
      } else {
        r.chk = false;
      }
      return r;
    });
    console.log(found);
    this.displayedColumnsTitleDemo = found;
    this.getDisplayedColumns();
  }

  // Download list in CSV
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
    this.download_csv(csv.join('\n'), 'Employee-List.csv');
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
    downloadLink.click();
    this.ngxService.stop();
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert'],
    });
  }

  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert'],
    });
  }

  designationCollection() { }

}
