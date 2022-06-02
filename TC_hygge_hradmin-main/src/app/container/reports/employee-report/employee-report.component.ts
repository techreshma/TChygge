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
import { PopupmodalComponent } from '../../../component/popupmodal/popupmodal.component';
import { SharedService } from 'src/app/service/shared.service';
import { employeeFilterArray } from '../../../constant/filterreport/employee';
import { element } from 'protractor';

import * as moment from 'moment'
import { extendMoment } from "moment-range";

import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface ModuleName {
  name: string,
  value: string
}

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss'],
})
export class EmployeeReportComponent implements OnInit {
  title = 'htmltopdf';
  @ViewChild('pdfTable') pdfTable: ElementRef;
  // set header column
  displayedColumns: string[] = [];

  //set static data for table
  dataSource: any = new MatTableDataSource([]);

  csvexcelDataSource: any = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  displayedColumnsTitleDemo: any[] = [
    // { title: 'First name', chk: true, value: 'first_name' },
    // { title: 'Last name', chk: true, value: 'last_name' },
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting_Manager' },
    { title: 'Designation', chk: true, value: 'designation' },
    { title: 'Dob', chk: true, value: 'dob' },
    { title: 'Gender', chk: true, value: 'gender' },
    { title: 'Email', chk: true, value: 'email' },
    { title: 'Phone', chk: true, value: 'mobile' },
  ];
  data: any = [];
  graphDepartmentData: any;
  graphNationalityData: any;
  graphGenderData: any;
  graphMaritalData: any;
  graphTopNationality: any;
  graphSalaryData: any;
  salaryAverage: any;
  graphAgeData: any;
  ageAverage: any;
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

  customizeData: any = [
    'name',
    'department',
    'reporting_Manager',
    'designation',
    'dob',
    'gender',
    'email',
    'mobile',
  ];

  constructor(
    public api: CommonServiceService,
    public _snackBar: MatSnackBar,
    public ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getReport();
    this.getList();
    this.getDisplayedColumns();
    this.getDepartment();
    this.loadService();
  }

  // Get Employee Report
  async getReport() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    this.ngxService.start();
    await this.api.employeeReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        console.log(response);
        if (response.success == true) {
          let departmentCount = response.data.deparment.sort(
            (a, b) => parseInt(b.employee) - parseInt(a.employee)
          );
          let nationality = response.data.nationalty.sort(
            (a, b) => parseInt(b.employee) - parseInt(a.employee)
          );
          let genderCount = response.data.gender.sort(
            (a, b) => parseInt(b.employee) - parseInt(a.employee)
          );
          let maritalCount = response.data.marital.sort(
            (a, b) => parseInt(b.employee) - parseInt(a.employee)
          );
          let salaryCount = response.data.average_salaryCriteria.sort(
            (a, b) => parseInt(b.salaryEmp) - parseInt(a.salaryEmp)
          );
          this.salaryAverage = !response.data.average_salary
            ? 0
            : response.data.average_salary;
          let ageCount = response.data.average_ageCriteria.sort(
            (a, b) => parseInt(b.ageEmp) - parseInt(a.employageEmpee)
          );
          //this.ageAverage = !response.data.age_average?0:!response.data.age_average;
          this.ageAverage = response.data.age_average
            ? response.data.age_average
            : 0;
          let topNationaly = nationality.slice(0, 5);

          console.log(departmentCount);
          this.graphDepartmentData = JSON.stringify({
            label:
              departmentCount.map((item) =>
                !item.department ? 'NA' : item.department
              ) || [],
            percentage: departmentCount.map((item) => item.employee) || [],
            width: 200,
            dataLabels: true,
          });

          this.graphNationalityData = JSON.stringify({
            label: nationality.map((item) =>
              !item.nationality ? 'NA' : item.nationality
            ),
            percentage: nationality.map((item) => item.employee),
            width: 200,
            dataLabels: true,
          });

          this.graphGenderData = JSON.stringify({
            label:
              genderCount.map((item) => (!item.gender ? 'NA' : item.gender)) ||
              [],
            percentage: genderCount.map((item) => item.employee) || [],
            width: 200,
            dataLabels: true,
          });

          maritalCount.forEach((elm: any) => {
            maritalCount.splice(
              1,
              maritalCount.indexOf(elm.marital_Status === 'null')
            );
          });

          this.graphMaritalData = JSON.stringify({
            label:
              maritalCount.map((item) =>
                !item.marital_Status ? 'NA' : item.marital_Status
              ) || [],
            percentage: maritalCount.map((item) => item.employee) || [],
            width: 200,
            dataLabels: true,
          });
          this.graphTopNationality = JSON.stringify({
            label: topNationaly.map((item) =>
              !item.nationality ? 'NA' : item.nationality
            ),
            percentage: topNationaly.map((item) => item.employee),
            width: 200,
            dataLabels: true,
          });
          this.graphSalaryData = JSON.stringify({
            label: salaryCount.map((item) =>
              !item.salary ? 'NA' : item.salary
            ),
            percentage: salaryCount.map((item) => item.salaryEmp),
            width: 200,
            dataLabels: true,
          });
          this.graphAgeData = JSON.stringify({
            label: ageCount.map((item) => (!item.ageKey ? 'NA' : item.ageKey)),
            percentage: ageCount.map((item) => item.ageEmp),
            width: 200,
            dataLabels: true,
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

  // Get Employee List
  async getList() {
    this.ngxService.start();
    await this.api.getEmployee().subscribe(
      (res) => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true) {


          this.getDesignation(response.data);
          this.getReportingManager(response.data);

          response.data.forEach((els: any) => {
            console.log(els.DOB)
          })

          this.data = response.data;
          this.tableRecord = response.data;
          this.getList = response.data
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
    await this.api.showDepartment().subscribe(
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

          employeeFilterArray['data'].forEach((els: any) => {
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
    employeeFilterArray['data'].forEach((els: any) => {
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
    employeeFilterArray['data'].forEach((els: any) => {
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



  //loadService
  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type == 'employee';
      if (check) {
        el.isReset
          ? this.resetFilter()
          : this.fetchFilterFunction(el.module_keyname, el.module_childarray);
      }
    });
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

  exportExcel() {
    // TableUtil.exportTableToExcel('csvTable');
    TableUtil.exportTableToExcel('csvTableExp');
  }

  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //#region  Filter modal function
  openFilterModal() {
    this.dialog.open(PopupmodalComponent, {
      width: '50em',
    });
    employeeFilterArray['filterArray'] = [];
    this.sharedService.reportFilterFunction(employeeFilterArray);
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

    // Lanzamos
    downloadLink.click();
    this.ngxService.stop();
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

  designationCollection() { }
}
