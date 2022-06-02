import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import { ElementRef } from '@angular/core';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';
import { badgesFilterObj } from '../../../constant/filterreport/badges'
import { SharedService } from 'src/app/service/shared.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface PeriodicElement {
  fname: string;
  department: string;
  reporting: string;
  badges_earned: number;
}
export interface PeriodicElementNew {
  badge_name: string;
  earned: string;
}

export interface ModuleName {
  name: string,
  value: string
}


const ELEMENT_DATA: PeriodicElement[] = [
  { fname: 'a', department: 'asd', reporting: 'H', badges_earned: 1, },
];
const ELEMENT_DATA_NEW: PeriodicElementNew[] = [
  { badge_name: 'b', earned: 'asd' },
];

@Component({
  selector: 'app-badges-report',
  templateUrl: './badges-report.component.html',
  styleUrls: ['./badges-report.component.scss']
})
export class BadgesReportComponent implements OnInit {

  tableFirst: boolean = true;
  tableSecond: boolean = false;
  total_badges: any = ''
  recoverFilter: any = [];
  data: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  modulename: ModuleName[] = [];

  // set header column
  displayedColumns: string[] = ['name', 'department', 'reporting', 'badges_earned', 'maritial_status'];

  displayedColumnsNew: string[] = ['badge_name', 'earned'];

  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([]);

  dataSourceNew = ELEMENT_DATA_NEW

  customizeData: any = [
    'name',
    'department',
    'reporting',
    'badges_earned',
    'maritial_status',
  ];

  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting' },
    { title: 'Badges Earned', chk: true, value: 'badges_earned' },
    { title: 'Maritial Status', chk: true, value: 'maritial_status' }
  ];

  filteredRecordData: any = [];
  departmentList: any = [];
  tablerecord:any = []



  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;


  lateEmployeeGraph: any = JSON.stringify({ label: ['emp', 'emp', 'emp'], percentage: [30, 20, 45], colors: ['blue'], height: 200 });
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
    this.getDepartment();
    this.getReport();
    this.loadService();
  }

  loadService() {

    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "badges"
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

    console.log(this.tablerecord)

    this.data.forEach((element) => {
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



  async getReport() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    this.ngxService.start();
    await this._api.badgesReportDetail(formData).subscribe(
      (res) => {
        console.log(res)
        this.ngxService.stop();

        const response:any = res;

        if (res.success == true) {
          this.tablerecord = response.data.user
          console.log(this.tablerecord)
          this.total_badges = response.data.total_badges;
          
          this.getReportingManager(response.data.user);

          this.getDesignation(response.data.user);

          this.dataSource = new MatTableDataSource([...response.data.user]);
          this.csvexcelDataSource = new MatTableDataSource([...response.data.user])

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort


          let lateEmpCount = response.data.user
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = response.data.user
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

          badgesFilterObj['data'].forEach((els: any) => {
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
    badgesFilterObj['data'].forEach((els: any) => {
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
    badgesFilterObj['data'].forEach((els: any) => {
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

    if (modArr.length === 0) {
      this.resetFilter()
    }
  }


  exportExcel() {
    //TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }

  resetFilter() {
    this.data = this.recoverFilter;
    this.dataSource = new MatTableDataSource([...this.data]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
  }


  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: "50em"
    })
    this.sharedService.reportFilterFunction(badgesFilterObj)
  }
  //#endregion

  showTab() {
    this.tableFirst = true;
    this.tableSecond = false;
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

  showCal() {
    this.tableFirst = false;
    this.tableSecond = true;
  }

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns)
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
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      Helvetica: {
        normal: 'Helvetica-Regular.ttf',
        bold: 'Helvetica-Medium.ttf',
        italics: 'Helvetica-Italic.ttf',
        bolditalics: 'Helvetica-MediumItalic.ttf'
      }
    }
    pdfMake.createPdf(documentDefinition).open();
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
