import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';
import { challengesFilterObj } from '../../../constant/filterreport/challenges'
import { SharedService } from 'src/app/service/shared.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface PeriodicElement {
  fname: string;
  department: string;
  reporting: string;
  challenges_participated: number;
  challenges_completed: number;
  total_available_challenges: number;
  participation_rate: number;
  completion_rate: number;
  reward_point: number;
  reward_redeemed: number;
}
export interface PeriodicElementNew {
  name_challenge: string;
  start_date: string;
  end_point: string;
  status: number;
  eligible_employees: number;
  employee_participated: number;
  employee_completion: number;
  per_participated: number;
  per_completion: number;
}

export interface ModuleName {
  name: string,
  value: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    fname: 'a',
    department: 'asd',
    reporting: 'H',
    challenges_participated: 1,
    challenges_completed: 2,
    total_available_challenges: 3,
    participation_rate: 4,
    completion_rate: 5,
    reward_point: 6,
    reward_redeemed: 7,
  },
];
const ELEMENT_DATA_NEW: PeriodicElementNew[] = [
  {
    name_challenge: 'b',
    start_date: 'asd',
    end_point: 'H',
    status: 1,
    eligible_employees: 2,
    employee_participated: 3,
    employee_completion: 4,
    per_participated: 5,
    per_completion: 6,
  },
];

@Component({
  selector: 'app-challenges-report',
  templateUrl: './challenges-report.component.html',
  styleUrls: ['./challenges-report.component.scss'],
})
export class ChallengesReportComponent implements OnInit {
  tableFirst: boolean = true;
  tableSecond: boolean = false;

  displayedColumnsNew: string[] = [
    'name_challenge',
    'start_date',
    'end_point',
    'status',
    'eligible_employees',
    'employee_participated',
    'employee_completion',
    'per_participated',
    'per_completion',
  ];

  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([]);

  dataSourceNew = ELEMENT_DATA_NEW;

  lateEmployeeGraph: any = JSON.stringify({
    label: ['emp', 'emp', 'emp'],
    percentage: [30, 20, 45],
    colors: ['blue'],
    height: 200,
  });

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  modulename: ModuleName[] = [];

  //challegeReport
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar,
    public sharedService: SharedService,
  ) { }

  completion: any;
  completion_percentage: any;
  numberReward_redeemed: any;
  participant: any;
  participant_percentage: any;
  rewardPoint_earn: any;
  total_challenge: any;

  data: any = [];
  filteredRecordData: any = [];
  departmentList: any = [];
  recoverFilter: any = [];


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  displayedColumns: string[] = [];

  tableRecord: any = [];


  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting_Manager' },
    { title: 'Challenges Participated', chk: true, value: 'challenge_participated' },
    { title: 'Challenges Completed', chk: true, value: 'challenge_completed' },
    { title: 'Total Available Challenges', chk: true, value: 'totalAvailable_challenge' },
    { title: 'Participation Rate', chk: true, value: 'participation_rate' },
    { title: 'Completion Rate', chk: true, value: 'completion_Rate' },
    { title: 'Reward Points Earned', chk: true, value: 'rewardPoint_earn' },
    { title: 'Reward Redeemed', chk: true, value: 'reward_redeemed' },
  ];
  customizeData: any = ['name', 'department', 'reporting_Manager', 'challenge_participated', 'challenge_completed', 'totalAvailable_challenge', 'participation_rate', 'completion_Rate', 'rewardPoint_earn', 'reward_redeemed'];

  ngOnInit(): void {
    this.getDisplayedColumns();
    this.getReport();
    this.getDepartment();
    this.loadService();
  }



  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "challenges"
      if (check) {
        console.log(el.isReset)
        el.isReset
          ? this.resetFilter()
          : this.fetchFilterFunction(el.module_keyname, el.module_childarray);
      }
    });
  }

  resetFilter() {
    this.data = this.recoverFilter;
    this.dataSource = new MatTableDataSource([...this.data]); //dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.csvexcelDataSource.sort = this.sort;
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

    console.log(this.tableRecord)

    this.tableRecord.forEach((element) => {
      values.forEach((val) => {
        var name: any = "";
        if (key === 'name') {
          name = element.first_name + " " + element.last_name;
        }

        console.log(element)
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

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo.filter(cd => cd.chk).map(cd => cd.value);
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

  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: "50em"
    })
    this.sharedService.reportFilterFunction(challengesFilterObj)
  }
  //#endregion

  exportExcel() {
    //TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }

  async getReport() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    this.ngxService.start();
    await this._api.challegeReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        this.tableRecord = res.data.user;
        let response: any = res;
        if (response.success == true) {
         
          console.log(this.tableRecord)
          this.getDesignation(this.tableRecord);
          this.getReportingManager(this.tableRecord);

          this.dataSource = new MatTableDataSource([...response.data.user]);
          this.csvexcelDataSource = new MatTableDataSource([...response.data.user]);
          
          
          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort

          this.completion = response.data.completion;
          this.completion_percentage = response.data.completion_percentage;
          this.numberReward_redeemed = response.data.numberReward_redeemed;
          this.participant = response.data.participant;
          this.participant_percentage = response.data.participant_percentage;
          this.rewardPoint_earn = response.data.rewardPoint_earn;
          this.total_challenge = response.data.total_challenge

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

  async getDepartment() {
    await this._api.showDepartment().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {
          this.data = response.data;

          let department_data = [];
          this.data.forEach((dep_el: any) => {
            department_data.push({
              title: dep_el.department_Type,
              value: dep_el.department_Type,
            });
          });

          challengesFilterObj['data'].forEach((els: any) => {
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
    challengesFilterObj['data'].forEach((els: any) => {
      if (els.value === 'designation') {
        els['childFilter'] = designation_data;
      }
    });
  }

  getReportingManager(data: any) {
    let reportingmanager = [];
    console.log("Inside Get Reporting")
    console.log(data)
    data.forEach((el: any) => {
      if (el.reporting_Manager !== '' && el.reporting_Manager !== null) {
        reportingmanager.push(el.reporting_Manager);
      }
    });

    console.log(reportingmanager)

    let uniqueData = Array.from(new Set(reportingmanager));
    let reportingmanager_data = [];
    uniqueData.forEach((rm_el: any) => {
      reportingmanager_data.push({ title: rm_el, value: rm_el });
    });
    challengesFilterObj['data'].forEach((els: any) => {
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
  showTab() {
    this.tableFirst = true;
    this.tableSecond = false;
  }
  showCal() {
    this.tableFirst = false;
    this.tableSecond = true;
  }

  addRemoveColumn(e) {
    console.log(e)
    let arr = [];
    const found = this.displayedColumnsTitleDemo.map(r => {
      if (e.indexOf(r.value) >= 0) {
        r.chk = true
      } else {
        r.chk = false
      }
      return r
    })
    console.log(found)
    this.displayedColumnsTitleDemo = found;
    this.getDisplayedColumns()
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
