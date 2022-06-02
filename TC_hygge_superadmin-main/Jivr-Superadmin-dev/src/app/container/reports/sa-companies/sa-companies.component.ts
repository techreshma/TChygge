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
  selector: 'app-sa-companies',
  templateUrl: './sa-companies.component.html',
  styleUrls: ['./sa-companies.component.scss']
})
export class SaCompaniesComponent implements OnInit {
  title = 'htmltopdf';
  displayedColumns: string[] = [];

  //set static data for table
  dataSource: any = new MatTableDataSource([]);

  csvexcelDataSource: any = new MatTableDataSource([]);

  @ViewChild('pdfTable') pdfTable: ElementRef;
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumnsTitleDemo: any[] = [
    { title: 'Company Id', chk: true, value: 'company_id' },
    { title: 'Industry', chk: true, value: 'Industry' },
    { title: 'Customer Acquisition', chk: true, value: 'customer_acquisition' },
    { title: 'Location City', chk: true, value: 'location_city' },
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Plan', chk: true, value: 'plan' },
    { title: 'Plan Activation Date', chk: true, value: 'plan_activation_date' },
    { title: 'Plan Expiry Date', chk: true, value: 'plan_expiry_date' },
    { title: 'Plan Status', chk: true, value: 'plan_status' },
    { title: 'Usage Score', chk: true, value: 'usage_score' },
  ];
  data: any = [];
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
  tableRecord: any = []
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

  //Company Graphdata start
  totalCompanies: any;
  topIndustriesGraphData: any;
  topCitiesGraphData: any;
  plansDetailGraphData: any;
  averageUsersCount: any;
  userCompanyGraphData: any;
  usageScoreAverage: any;
  usageScoreCompaniesGraphData: any
  //Company Graphdata end

  planCompanyChart: string = JSON.stringify({
    label: ['Plan 1', 'Plan 2', 'Plan 3', 'Plan 4', 'Plan 5'],
    percentage: [80, 50, 40, 10, 45],
    colors: ['#15C1DC', '#FF6384']
  });
  userGenderChart: string = JSON.stringify({ label: ['Plan1', 'Plan2'], percentage: [60, 40], colors: ['#15C1DC', '#FFAA27', '#F44336', '#F44350'] });

  usersRange: any = true;
  usageCheck: any = true;

  ageBasedOn: any = 'average'

  //User for customization
  customizeData: any = [
    "company_id",
    "Industry",
    "customer_acquisition",
    "location_city",
    "name",
    "plan",
    "plan_activation_date",
    "plan_expiry_date",
    "plan_status",
    "usage_score"
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
    this.companyReport();
  }

  //companyReport
  async companyReport() {
    this.ngxService.start();
    await this.api.companyReport().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.totalCompanies = response.data.comapnyGraphData.totalCompanies;

          this.topIndustriesGraphData = JSON.stringify({
            label: response.data.comapnyGraphData.topIndustries.map((item) => item.industry_name),
            percentage: response.data.comapnyGraphData.topIndustries.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          this.topCitiesGraphData = JSON.stringify({
            label: response.data.comapnyGraphData.topCities.map((item) => item.city_name),
            percentage: response.data.comapnyGraphData.topCities.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          this.plansDetailGraphData = JSON.stringify({
            label: response.data.comapnyGraphData.plansDetail.map((item) => item.plan_name),
            percentage: response.data.comapnyGraphData.plansDetail.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          this.averageUsersCount = response.data.comapnyGraphData.userCompany.averageUsersCount;
          this.userCompanyGraphData = JSON.stringify({
            label: response.data.comapnyGraphData.userCompany.companyUsers.map((item) => item.company_name),
            percentage: response.data.comapnyGraphData.userCompany.companyUsers.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          this.usageScoreAverage = response.data.comapnyGraphData.usageScoreAverage === "" ?
            0 : response.data.comapnyGraphData.usageScoreAverage;
          //usageScoreCompanies
          this.usageScoreCompaniesGraphData = JSON.stringify({
            label: response.data.comapnyGraphData.usageScoreCompanies.map((item) => item.company_name),
            percentage: response.data.comapnyGraphData.usageScoreCompanies.map((item) => item.value),
            colors: ['#15C1DC', '#FF6384'],
            width: 250,
          })

          this.csvexcelDataSource = new MatTableDataSource([...response.data.companiesReportDetail]);
          this.csvexcelDataSource.sort = this.sort;

          this.dataSource = new MatTableDataSource([...response.data.companiesReportDetail]); //dataSource
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


    var arrayColumn = this.displayedColumns
    var xSwap = arrayColumn.indexOf('company_id')
    var ySwap = arrayColumn.indexOf('name')
    var b = arrayColumn[ySwap];
    arrayColumn[ySwap] = arrayColumn[xSwap];
    arrayColumn[xSwap] = b;
    console.log(arrayColumn)
  }


  exportExcel() {
    TableUtil.exportTableToExcel('csvTableExp');
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
    this.download_csv(csv.join('\r\n'), 'Company Report.csv');
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