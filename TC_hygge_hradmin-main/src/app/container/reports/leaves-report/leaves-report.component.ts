import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import {
  EventSettingsModel,
  ScheduleComponent,
} from '@syncfusion/ej2-angular-schedule';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';
import { leavesFilterObj } from 'src/app/constant/filterreport/leaves';
import { SharedService } from 'src/app/service/shared.service';


export interface PeriodicElement {
  name: string;
  department: string;
  report: string;
  sick: number;
  paid: number;
  unpaid: number;
  emergency: number;
  special: number;
  leave: number;
  total_leave: number;
}
export interface ModuleName {
  name: string,
  value: string
}


@Component({
  selector: 'app-leaves-report',
  templateUrl: './leaves-report.component.html',
  styleUrls: ['./leaves-report.component.scss'],
})
export class LeavesReportComponent implements OnInit {
  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild('scheduleObj', { static: true })
  public scheduleObj: ScheduleComponent;
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false,
    dataSource: [],
  };

  customizeData: any = [
    'Annual',
    'Medical',
    'Study',
    'Maternity/ Paternity',
    'Compassionate',
    'leaveTaken',
    'leave_balance',
  ];

  from: any;
  data: any = []
  to: any;
  title = 'htmltopdf';
  @ViewChild('pdfTable') pdfTable: ElementRef;
  // set header column
  displayedColumns: string[] = [];
  displayedColumnsTitleDemo: any[] = [];
  //set static data for table
  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([])

  showTable: boolean = true;
  responseData: any = {};
  recoverFilter: any = [];
  filteredRecordData: any = [];
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  filterMonth: string = '1month';
  lateEmployeeGraph: any = JSON.stringify({
    label: ['emp', 'emp', 'emp'],
    percentage: [30, 20, 45],
    colors: ['blue'],
    height: 200,
  });

  modulename: ModuleName[] = [];

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar,
    public sharedService: SharedService,
  ) { }


  ngOnInit(): void {
    this.filterDataTime(this.filterMonth);
    this.loadService();
    this.getDisplayedColumns();
    this.getDepartment();
    this.loadService();
  }

  loadService() {



    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "leaves"
        if (check) {
          el.isReset
            ? this.resetFilter()
            : this.fetchFilterFunction(el.module_keyname, el.module_childarray);
        }
      });
  }

  fetchFilterFunction(key: any, values: any) {
    this.filteredRecordData = [];
    this.modulename = []
    values.forEach((el:any)=>{
       this.modulename.push({
        name: key,
        value: el
      })
    })

    this.data.forEach((element) => {
      values.forEach((val) => {
        var name:any = "";
        if(key === 'name'){
          name = element.first_name+" "+element.last_name;
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

  resetFilter() {
    this.data = this.recoverFilter;
    this.dataSource = new MatTableDataSource([...this.data]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  async getDepartment() {
    await this._api.showDepartment().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.data = response.data;

          console.log(this.data);
          let department_data = [];
          this.data.forEach((dep_el: any) => {
            department_data.push({
              title: dep_el.department_Type,
              value: dep_el.department_Type,
            });
          });

          leavesFilterObj['data'].forEach((els: any) => {
            if (els.value === 'department') {
              console.log(els);
              els['childFilter'] = department_data;
            }
          });
        } else {
        }
      },
      (err) => {
        const error = err.error;
      }
    );
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
    leavesFilterObj['data'].forEach((els: any) => {
      if (els.value === 'designation') {
        els['childFilter'] = designation_data;
      }
    });
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
    leavesFilterObj['data'].forEach((els: any) => {
      if (els.value === 'reporting_Manager') {
        els['childFilter'] = reportingmanager_data;
      }
    });
  }

  add(data): void {

    // Add our fruit
      this.modulename.push(data);

  }

  remove(modulename: ModuleName): void {
    let modArr:any = modulename
    const index = this.modulename.indexOf(modulename);

    if (index >= 0) {
      this.modulename.splice(index, 1);
    }

    if(modArr.length === 0){
      this.resetFilter()
    }
  }
  exportExcel() {
    //TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }

  clickSchedule(event: any, sobj: any) {
    let iscellClick = event.target
      .getAttribute('class')
      .includes('e-work-cells');
    if (iscellClick) {
      console.log(moment(sobj.startTime).format('YYYY-MM-DD'));
    } else {
      let month = moment(sobj.monthModule.monthDates.start).month() + 1;
      let year = moment(sobj.monthModule.monthDates.start).year();
      this.getReportCalendar(month, year);
    }
  }

  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: "50em"
    })
    this.sharedService.reportFilterFunction(leavesFilterObj)
  }
  //#endregion

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
    .filter((cd) => cd.chk)
    .map((cd) => cd.title);
    
  }

  // paginationChange(e) {
  //   this.pageEvent = e;
  //   console.log(this.pageEvent);
  //   this.getReport(e.pageIndex, e.pageSize);
  // }

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

  export() {
    this.ngxService.start();
    //const html = document.getElementById('csvTable');
    const html = document.getElementById('csvTableExp');
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

    this.download_csv(csv.join('\n'), 'document-list.csv');
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
    this.getReport(from , to);
  }

  async getReportCalendar(month: any, year: any) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      month: month,
      year: year,
    };
    this.ngxService.start();
    await this._api.leaveReportCalender(formData).subscribe(
      (res) => {
        this.displayedColumnsTitleDemo = [];
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          console.log(res.data);
          console.log(this.selectedDate);
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  async getReportCalendarDetail(date: any) {
    console.log(date);
  }

  async getReport(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
      // page: page,
      // pagination: pagination,
    };
    this.ngxService.start();
    await this._api.leaveReport(formData).subscribe(
      (res) => {
        this.displayedColumnsTitleDemo = [];
        this.ngxService.stop();
        const response: any = res;

        if (response.success == true) {
          this.responseData = response.data;
          this.length = response.length;

          let resp = response.data.user_Leave.map((item) => {
            let obj = { ...item };
            item.leave.map((sub) => {
              obj[sub.key] = sub.value;
            });
            return obj;
          });

          console.log(res)

          this.dataSource = new MatTableDataSource([...resp]);
          this.csvexcelDataSource = new MatTableDataSource([...resp])

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort;


          for (let item of response.data.leave_type) {
            this.displayedColumnsTitleDemo.push({
              title: item.leave_Type,
              chk: true,
              value: item.leave_Type,
            });
          }
          this.displayedColumnsTitleDemo.push(
            { title: 'Taken Leave', chk: true, value: 'leaveTaken' },
            { title: 'Remaining Leave', chk: true, value: 'leave_balance' }
          );
          this.getDisplayedColumns();
          let lateEmpCount = resp
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = resp
            .sort((a, b) => parseInt(b.leaveCount) - parseInt(a.leaveCount))
            .splice(0, 5);

          this.lateEmployeeGraph = JSON.stringify({
            label: lateEmpCount.map((item) => item.name),
            percentage: lateEmpCount.map((item) => item.lateCount),
            colors: ['blue'],
            height: 200,
          });
        } else {
        }
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  addRemoveColumn(e) {
    const found = this.displayedColumnsTitleDemo.map((r) => {
      if (e.indexOf(r.value) >= 0) {
        r.chk = true;
      } else {
        r.chk = false;
      }
      return r;
    });
    this.displayedColumnsTitleDemo = found;
    this.getDisplayedColumns();
  }

  showTab() {
    this.showTable = true;
  }

  showCal() {
    this.showTable = false;
    this.getReportCalendar(moment().month() + 1, moment().year());
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
