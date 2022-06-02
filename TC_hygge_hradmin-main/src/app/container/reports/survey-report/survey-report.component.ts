import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/service/shared.service';
import { surveyFilterObj } from '../../../constant/filterreport/survey'
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface PeriodicElement {
  name_of_survey: string;
  start_date: string;
  end_date: string;
  questions: number;
  eligible_participants: number;
  submissions_completion: number;
  survey_started: number;
  status: string;
}

export interface ModuleName {
  name: string,
  value: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name_of_survey: 'a',
    start_date: '10/01/2021',
    end_date: '20/01/2021',
    questions: 1,
    eligible_participants: 2,
    submissions_completion: 3,
    survey_started: 4,
    status: 'true',
  },
];

@Component({
  selector: 'app-survey-report',
  templateUrl: './survey-report.component.html',
  styleUrls: ['./survey-report.component.scss'],
})
export class SurveyReportComponent implements OnInit {
  tableFirst: boolean = true;
  tableSecond: boolean = false;
  filterMonth: string = '1month';
  fileName = 'ExcelSheet.xlsx';
  // set header column
  displayedColumns: string[] = [
    'name_of_survey',
    'start_date',
    'end_date',
    'questions',
    'eligible_participants',
    'submissions_completion',
    'survey_started',
    'status',
  ];
  data: any = [];

  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([]);

  lateEmployeeGraph: any = JSON.stringify({
    label: ['emp', 'emp', 'emp'],
    percentage: [30, 20, 45],
    colors: ['blue'],
    height: 200,
  });
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  OccurEmployeeGraph: any;

  tableRecord: any = []

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  modulename: ModuleName[] = [];

  total_survey: any;
  completed_survey: any;
  completion_rate: any;
  open_survey: any;
  filteredRecordData: any = [];
  departmentList: any = [];
  recoverFilter: any = [];
  customizeData: any = [
    'name_of_survey',
    'start_date',
    'end_date',
    'questions',
    'eligible_participants',
    'submissions_completion',
    'survey_started',
    'status',
  ];

  displayedColumnsTitleDemo: any[] = [
    { title: 'Survey name', chk: true, value: 'name_of_survey' },
    { title: 'Start date', chk: true, value: 'start_date' },
    { title: 'End date', chk: true, value: 'end_date' },
    { title: 'Questions', chk: true, value: 'questions' },
    { title: 'Eligible Participants', chk: true, value: 'eligible_participants' },
    { title: 'Submissions Completion', chk: true, value: 'submissions_completion' },
    { title: 'Survey Started', chk: true, value: 'survey_started' },
    { title: 'Status', chk: true, value: 'status' }
  ];

  constructor(
    public _snackBar: MatSnackBar,
    public ngxService: NgxUiLoaderService,
    public _api: CommonServiceService,
    public dialog: MatDialog,
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.filterDataTime(this.filterMonth);
    this.loadService();
    this.getDisplayedColumns();
    this.getDepartment();
  }

  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "survey"
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
    values.forEach((el: any) => {
      this.modulename.push({
        name: key,
        value: el
      })
    })

   this.tableRecord.forEach((element) => {
      values.forEach((val) => {
        if (element[key] === val) {
          this.filteredRecordData.push(element);
        }
      });
    });
    console.log(this.filteredRecordData)

    this.dataSource = new MatTableDataSource([...this.filteredRecordData]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }

  resetFilter() {
    this.data = this.tableRecord;
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

          surveyFilterObj['data'].forEach((els: any) => {
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
    surveyFilterObj['data'].forEach((els: any) => {
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
    surveyFilterObj['data'].forEach((els: any) => {
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
    let modArr: any = modulename
    const index = this.modulename.indexOf(modulename);

    if (index >= 0) {
      this.modulename.splice(index, 1);
    }
    
    if (this.modulename.length === 0) {
      this.resetFilter()
    }
  }

  addRemoveColumn(e) {
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

  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: "50em"
    })
    this.sharedService.reportFilterFunction(surveyFilterObj)
  }
  //#endregion

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns)
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
    this.getReport(from, to);
  }

  async getReport(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
    };
    this.ngxService.start();
    await this._api.surveyReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.tableRecord = response.data.surveyDetails
          this.dataSource = new MatTableDataSource([
            ...response.data.surveyDetails,
          ]);
          this.csvexcelDataSource = new MatTableDataSource([
            ...response.data.surveyDetails,
          ]);

          this.total_survey = response.data.total_survey;
          this.completed_survey = response.data.completed_survey;
          this.completion_rate = response.data.completion_rate;
          this.open_survey = response.data.open_survey;

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort;

          let lateEmpCount = response.data.surveyDetails
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = response.data.surveyDetails
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

    // Lanzamos
    downloadLink.click();
    this.ngxService.stop();
  }

  exportExcel() {
    //TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
