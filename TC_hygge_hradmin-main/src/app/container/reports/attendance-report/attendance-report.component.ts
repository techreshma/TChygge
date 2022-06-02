import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { SharedService } from 'src/app/service/shared.service';
import { attendanceFilterObj } from '../../../constant/filterreport/attendance'
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';


export interface PeriodicElement {
  name: string;
  department: string;
  reporting: string;
  days: number;
  days_on: number;
  hours: number;
  total_work: number;
  excess_deficient: number;
}

export interface ModuleName {
  name: string,
  value: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Hydrogen',
    department: 'asd',
    reporting: 'H',
    days: 1,
    days_on: 2,
    hours: 3,
    total_work: 4,
    excess_deficient: 5,
  },
  // {name: 'Hydrogen', department: 'asd', reporting: 'H', days: 1, days_on: 2, hours: 3, total_work: 4, excess_deficient: 5},
  // {name: 'Hydrogen', department: 'asd', reporting: 'H', days: 1, days_on: 2, hours: 3, total_work: 4, excess_deficient: 5},
];

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss'],
})
export class AttendanceReportComponent implements OnInit {
  title = 'htmltopdf';
  @ViewChild('pdfTable') pdfTable: ElementRef;
  // set header column
  displayedColumns: string[] = [];
  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting_Manager' },
    { title: 'Days Late', chk: true, value: 'days_late' },
    { title: 'Days on leave', chk: true, value: 'days_on_leave' },
    { title: 'Hours Worked', chk: true, value: 'hours_worked' },
    { title: 'Total Work', chk: true, value: 'total_work' },
    { title: 'Excess/Deficient', chk: true, value: 'excess_deficient' },
  ];
  //set static data for table
  dataSource = new MatTableDataSource([]);

  csvexcelDataSource: any = new MatTableDataSource([])
  // dataSource = ELEMENT_DATA;

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  imgPath = environment.apiBaseUrl;
  graphData: any;
  lateEmployeeGraph: any;
  OccurEmployeeGraph: any;
  departmentGraph: any;
  heatGraph: any;
  data: any = [];
  tablerecord:any = []
  responseData: any = [];
  accessPermission: boolean;
  departmentData: any = [];
  filterMonth: string = '1month';
  activeChallanges: number = 0;
  totalParticipant: number = 0;
  graphDetail: any;
  graphMale: number = 0;
  graphFemale: number = 0;
  mainDays: number = 0;
  late_hour: number = 0;
  leave_day: number = 0;
  late_occurrence: number = 0;
  work_hour: number = 0;
  total_hour_work: number = 0;
  exDef: any;
  latePer: any;
  filterData: string[] = ['1month', '6month', '1year', '2year', '3year'];
  filteredRecordData: any = [];
  customizeData: any = [
    'name',
    'department',
    'reporting_Manager',
    'days_late',
    'days_on_leave',
    'hours_worked',
    'total_work',
    'excess_deficient',
  ];
  recoverFilter: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
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
    this.getDisplayedColumns();
    this.filterDataTime(this.filterMonth);
    this.getDepartment();
    this.loadService();
    //this.getList();
    this.getDisplayedColumns();
    this.getDepartment();
  }

  resetFilter() {
    //this.data = this.recoverFilter;
    this.dataSource = new MatTableDataSource([...this.tablerecord]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "attendance"
      if (check) {
        el.isReset
          ? this.resetFilter()
          : this.fetchFilterFunction(el.module_keyname, el.module_childarray);
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

    console.log("Before splice" , index)
    if (index >= 0) {
      this.modulename.splice(index, 1);
    }

    if(this.modulename.length === 0){
      this.resetFilter()
    }
  }

  // Get Employee List
  async getList() {
    this.ngxService.start();
    await this._api.getEmployee().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.getDesignation(response.data);


          this.data = response.data;
          this.recoverFilter = response.data;

          this.csvexcelDataSource = new MatTableDataSource([...this.data]);
          this.csvexcelDataSource.sort = this.sort;

          this.dataSource = new MatTableDataSource([...this.data]); //dataSource
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  //Get Department
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

          attendanceFilterObj['data'].forEach((els: any) => {
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
  fetchFilterFunction(key: any, values: any) {
    this.filteredRecordData = [];
    this.modulename = [];
    values.forEach((el:any)=>{
       this.modulename.push({
        name: key,
        value: el
      })
    })

    this.tablerecord.forEach((element) => {
      values.forEach((val) => {
        var name:any = "";
        if(key === 'name'){
          name = element.first_name+" "+element.last_name;
          console.log(name)
        }
        key = (key === 'reporting_Manager') ? 'report_manager' : key;
        if (element[key] === val || name === val) {
          console.log(element)
          this.filteredRecordData.push(element);
        }
      });
    });

    this.dataSource = new MatTableDataSource([...this.filteredRecordData]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
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
    attendanceFilterObj['data'].forEach((els: any) => {
      if (els.value === 'designation') {
        els['childFilter'] = designation_data;
      }
    });
  }

  getReportingManager(data: any) {
    //reporting_Manager
    let reportingmanager = [];
    data.forEach((el: any) => {
      console.log(el)
      if (el.report_manager !== '' && el.report_manager !== null) {
        reportingmanager.push(el.report_manager);
      }
    });

    let uniqueData = Array.from(new Set(reportingmanager));
    let reportingmanager_data = [];
    uniqueData.forEach((rm_el: any) => {
      reportingmanager_data.push({ title: rm_el, value: rm_el });
    });
    attendanceFilterObj['data'].forEach((els: any) => {
      if (els.value === 'reporting_Manager') {
        console.log(els)
        els['childFilter'] = reportingmanager_data;
      }
    });

  }

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns);
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

  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: "50em"
    })
    this.sharedService.reportFilterFunction(attendanceFilterObj)
  }
  //#endregion

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
    this.getReport(from, to);
  }

  async getReport(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
    };
    this.ngxService.start();
    await this._api.attendanceReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        console.log(response);
        if (response.success == true) {
          this.tablerecord = response.data.attendance_detail
          // this.getDesignation(response.data.attendance_detail);
          this.getReportingManager(response.data.attendance_detail);



          this.dataSource = new MatTableDataSource([
            ...response.data.attendance_detail,
          ]);

          this.csvexcelDataSource = new MatTableDataSource([...response.data.attendance_detail])
          this.csvexcelDataSource.sort = this.sort;

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.mainDays = response.data.man_day;
          this.late_hour = response.data.late_hour;
          this.leave_day = response.data.leave_day;
          this.late_occurrence = response.data.late_occurrence;
          this.work_hour = response.data.work_hour;
          this.total_hour_work = response.data.total_hour_work;
          this.exDef = ((this.total_hour_work * 100) / this.work_hour).toFixed(
            2
          );
          this.latePer = ((this.late_occurrence * 100) / this.mainDays).toFixed(
            2
          );

          let lateEmpCount = response.data.attendance_detail
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = response.data.attendance_detail
            .sort((a, b) => parseInt(b.leaveCount) - parseInt(a.leaveCount))
            .splice(0, 5);

          this.lateEmployeeGraph = JSON.stringify({
            label: lateEmpCount.map((item) => item.name),
            percentage: lateEmpCount.map((item) => item.lateCount),
            colors: ['blue'],
            height: 200,
          });
          this.OccurEmployeeGraph = JSON.stringify({
            label: leaveEmpCount.map((item) => item.name),
            percentage: leaveEmpCount.map((item) => item.leaveEmpCount),
            colors: ['pink'],
            height: 200,
          });
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

  // Download list in CSV
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
    this.download_csv(csv.join('\n'), 'Employee-List.csv');
  }

  exportExcel() {
    //TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
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

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
