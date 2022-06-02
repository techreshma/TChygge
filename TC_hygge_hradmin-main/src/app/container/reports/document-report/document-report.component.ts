import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import htmlToPdfmake from 'html-to-pdfmake';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from '../../../component/popupmodal/popupmodal.component';
import { documentsFilterObj } from '../../../constant/filterreport/documents'
import { SharedService } from 'src/app/service/shared.service';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
export interface PeriodicElement {
  name: string;
  department: string;
  report: string;
  marital: string;
  document_uplaod: number;
  document_missing: number;
  document_expire: number;
}
export interface PeriodicNewElement {
  document_name: string;
  document_uplaod: number;
  document_missing: number;
  document_expire: number;
}

export interface ModuleName {
  name: string,
  value: string
}


const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'a',
    department: '1.0079',
    report: 'H',
    marital: 'mater',
    document_uplaod: 2,
    document_missing: 3,
    document_expire: 4,
  },
];
const ELEMENT_DATA_New: PeriodicNewElement[] = [
  {
    document_name: 'b',
    document_uplaod: 1,
    document_missing: 2,
    document_expire: 3,
  },
];

@Component({
  selector: 'app-document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.scss'],
})

export class DocumentReportComponent implements OnInit {
  showTabNew: boolean = false;
  showTab: boolean = true;

  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([])

  employeeExpiring_document: string;
  employeeMissing_document: string
  expiring_document: string
  missing_document: string
  uploaded_document: string
  data: any = [];
  tableRecord:any = []

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  modulename: ModuleName[] = [];
  recoverFilter: any = [];
  // set header column
  displayedColumns: string[] = [
    'name',
    'department',
    'report',
    'marital',
    'document_uplaod',
    'document_missing',
    'document_expire',
  ];

  customizeData: any = [
    'name',
    'department',
    'report',
    'marital',
    'document_uplaod',
    'document_missing',
    'document_expire',
  ];

  dataSourceNew = ELEMENT_DATA_New;
  filteredRecordData: any = [];
  displayedColumnsNew: string[] = [
    'document_name',
    'document_uplaod',
    'document_missing',
    'document_expire',
  ];

  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'report' },
    { title: 'Marital Status', chk: true, value: 'marital' },
    { title: 'Document Upload', chk: true, value: 'document_uplaod' },
    { title: 'Document Missing', chk: true, value: 'document_missing' },
    { title: 'Document Expire', chk: true, value: 'document_expire' },
  ];

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  filterMonth: string = '1month';
  lateEmployeeGraph: any = JSON.stringify({
    label: ['emp', 'emp', 'emp'],
    percentage: [30, 20, 45],
    colors: ['blue'],
    height: 200,
  });

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
  }

  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "documents"
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

    this.tableRecord.forEach((element) => {
      values.forEach((val) => {
        var name:any = "";
        if(key === 'name'){
          name = element.first_name+" "+element.last_name;
        }

        console.log(element, key)
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

          documentsFilterObj['data'].forEach((els: any) => {
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
    documentsFilterObj['data'].forEach((els: any) => {
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
    documentsFilterObj['data'].forEach((els: any) => {
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

    if(this.modulename.length === 0){
      this.resetFilter()
    }
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
    this.sharedService.reportFilterFunction(documentsFilterObj)
  }
  //#endregion

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns)
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
    await this._api.documentReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;

        console.log(response)
        if (response.success == true) {
          this.tableRecord = response.userDetailArr
          this.getDesignation(response.userDetailArr)
          this.getReportingManager(response.userDetailArr)
          this.dataSource = new MatTableDataSource([
            //...response.data.user,
            ...response.userDetailArr,
          ]);
          this.csvexcelDataSource = new MatTableDataSource([
            //...response.data.user,
            ...response.userDetailArr,
          ]);

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort

          this.employeeExpiring_document = response.data.employeeExpiring_document;
          this.employeeMissing_document = response.data.employeeMissing_document
          this.expiring_document = response.data.expiring_document
          this.missing_document = response.data.missing_document
          this.uploaded_document = response.data.uploaded_document

          //let lateEmpCount = response.data.user
          let lateEmpCount = response.userDetailArr
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = response.userDetailArr
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
        console.log(res);
      },
      (err) => {
        const error = err.error;
        this.ngxService.stop();
      }
    );
  }

  showTable() {
    this.showTab = true;
    this.showTabNew = false;
  }
  showNewTable() {
    this.showTab = false;
    this.showTabNew = true;
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
