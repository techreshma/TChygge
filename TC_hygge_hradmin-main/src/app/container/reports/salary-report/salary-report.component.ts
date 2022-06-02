import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import { TableUtil } from '../../../common/tableutil/tableUtil';
import { PopupmodalComponent } from 'src/app/component/popupmodal/popupmodal.component';
import { SharedService } from 'src/app/service/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { salaryFilterObj } from '../../../constant/filterreport/salary'
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface PeriodicElement {
  name: string;
  department: string;
  reporting: string;
  basic: string;
  allowances: string;
  total_salary: string;
}

export interface PeriodicElementNew {
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
}

export interface ModuleName {
  name: string,
  value: string
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Esther Copland',
    department: 'Sales',
    reporting: 'William John',
    basic: '10k',
    allowances: '05k',
    total_salary: '15k',
  },
];

const ELEMENT_DATA_NEW: PeriodicElementNew[] = [
  {
    january: '100k',
    february: '100k',
    march: '200k',
    april: '200k',
    may: '300k',
    june: '300k',
    july: '400k',
    august: '400k',
    september: '500k',
    october: '500k',
  },
];

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.scss'],
})
export class SalaryReportComponent implements OnInit {
  tableFirst: boolean = true;
  tableSecond: boolean = false;
  graphData: any;
  redeemLineChart: any;
  pointsLineChart: any;
  departmentGraph: any;
  redeemRewardGraph: any;
  filterMonth: string = '1month';
  modulename: ModuleName[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tableRecord: any = [];

  average_salary: any;
  total_salary: any;
  colors = [
    '#3F51B5',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#BAC0E1',
    '#CED2E8',
    '#5363BC',
    '#7C88CB',
    '#A5ADDA',
    '#BAC0E1',
    '#CED2E8',
    '#E3E5F0',
    '#F7F7F7',
    '#3F51B5',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#5363BC',
    '#6876C4',
    '#7C88CB',
    '#BAC0E1',
    '#CED2E8',
    '#5363BC',
    '#7C88CB',
    '#A5ADDA',
    '#BAC0E1',
    '#CED2E8',
    '#E3E5F0',
    '#F7F7F7',
  ];

  // set header column
  displayedColumns: string[] = [
    'name',
    'department',
    'reporting',
    'basic',
    'allowances',
    'total_salary',
  ];

  displayedColumnsNew: string[] = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
  ];

  customizeData: any = [
    'name',
    'department',
    'reporting',
    'basic',
    'allowances',
    'total_salary',
  ];

  displayedColumnsTitleDemo: any[] = [
    { title: 'Name', chk: true, value: 'name' },
    { title: 'Department', chk: true, value: 'department' },
    { title: 'Reporting manager', chk: true, value: 'reporting' },
    { title: 'Basic', chk: true, value: 'basic' },
    { title: 'Allowance', chk: true, value: 'allowances' },
    { title: 'Total Salary', chk: true, value: 'total_salary' }
  ];

  //set static data for table
  dataSource = new MatTableDataSource([]);
  csvexcelDataSource = new MatTableDataSource([]);
  data: any = [];
  filteredRecordData: any = [];
  recoverFilter: any = [];

  dataSourceNew = ELEMENT_DATA_NEW;
  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  constructor(
    public api: CommonServiceService,
    public _snackBar: MatSnackBar,
    public ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getGraphData();
    this.getTopRedeemGraphData();
    this.getRedeemGraphData();

    this.getDepartment();
    this.filterDataTime(this.filterMonth);
    this.loadService();
    this.getDisplayedColumns();
  }

  async getGraphData() {
    // this.ngxService.start();
    await this.api
      .graphReward({
        company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      })
      .subscribe(
        (res) => {
          // this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            let respData = response.data;
            let Department: any = [];
            let DepartmentCount: any = [];
            let graphMale = 0;
            let graphFemale = 0;
            for (let item of respData) {
              graphMale += item.male;
              graphFemale += item.female;
              for (let dep of item.DepartmentnewArray) {
                let index = Department.findIndex(
                  (subDep) => subDep == dep.department
                );
                if (index > -1) {
                  DepartmentCount[index] += dep.count;
                } else {
                  Department.push(dep.department);
                  DepartmentCount.push(dep.count);
                }
              }
            }
            this.departmentGraph = JSON.stringify({
              label: Department,
              percentage: DepartmentCount,
              colors: this.colors,
              dataName: 'Rewards',
            });
            this.graphData = JSON.stringify({
              label: ['Male', 'Female'],
              percentage: [graphMale, graphFemale],
              colors: ['#3F51B5', '#576DE6'],
              dataName: 'Points',
            });
          } else {
            // this.openErrrorSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          // this.ngxService.stop();
          // this.openErrrorSnackBar(error.message);
        }
      );
  }
  async getTopRedeemGraphData() {
    // this.ngxService.start();
    await this.api
      .graphTopRedeemReward({
        company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      })
      .subscribe(
        (res) => {
          // this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            let respData = response.data;
            let label = [];
            let point = [];
            let color = [];
            for (let item of respData) {
              label.push(item.reward_Name);
              point.push(item.redeem_Point);
              color.push('#FFAA00');
            }
            this.redeemRewardGraph = JSON.stringify({
              label: label,
              percentage: point,
              colors: color,
            });
          } else {
            // this.openErrrorSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          // this.ngxService.stop();
          // this.openErrrorSnackBar(error.message);
        }
      );
  }
  async getRedeemGraphData() {
    // this.ngxService.start();
    await this.api
      .graphRedeemReward({
        company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      })
      .subscribe(
        (res) => {
          // this.ngxService.stop();
          const response: any = res;
          if (response.success == true) {
            let respData = response.data;
            let label = [];
            let point = [];
            let point1 = [];
            let color = [];

            let color1 = [];
            for (let item of respData) {
              label.push(item.month);
              point.push(item.reward_Number);
              point1.push(item.reward_point);
              color.push('#008cf8');
              color1.push('#f8007c');

            }

            
            this.redeemLineChart = JSON.stringify({
              label: label,
              percentage: point,
              colors: color,
            });
            this.pointsLineChart = JSON.stringify({
              label: label,
              percentage: point1,
              colors: color1,
            });
          } else {
            // this.openErrrorSnackBar(response.message);
          }
          console.log(res);
        },
        (err) => {
          const error = err.error;
          // this.ngxService.stop();
          // this.openErrrorSnackBar(error.message);
        }
      );
  }
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

          salaryFilterObj['data'].forEach((els: any) => {
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

  loadService() {
    this.sharedService.modalfilterService.subscribe((el: any) => {
      let check = el.report_type === "salary"
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

    key = (key === 'reporting') ? 'reporting_Manager' : key;

    this.tableRecord.forEach((element) => {
      values.forEach((val) => {
        var name: any = "";
        if (key === 'name') {
          name = element.first_name + " " + element.last_name;
        }
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

  resetFilter() {
    this.data = this.tableRecord;
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
    this.sharedService.reportFilterFunction(salaryFilterObj)
  }
  //#endregion
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
    salaryFilterObj['data'].forEach((els: any) => {
      if (els.value === 'designation') {
        els['childFilter'] = designation_data;
      }
    });
  }

  getReportingManager(data: any) {
    //reporting_Manager
    let datael = data
    let reportingmanager = [];
    datael.forEach((el: any) => {
      if (el.reporting_Manager !== '' && el.reporting_Manager !== null) {
        reportingmanager.push(el.reporting_Manager);
      }
    });
    let uniqueData = Array.from(new Set(reportingmanager));
    let reportingmanager_data = [];
    uniqueData.forEach((rm_el: any) => {
      reportingmanager_data.push({ title: rm_el, value: rm_el });
    });
    salaryFilterObj['data'].forEach((els: any) => {
      if (els.value === 'reporting') {
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

  getDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsTitleDemo
      .filter((cd) => cd.chk)
      .map((cd) => cd.value);
    console.log(this.displayedColumns)
  }

  async getReport(sDate, eDate) {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
      start_date: sDate,
      end_date: eDate,
    };
    this.ngxService.start();
    await this.api.salaryReport(formData).subscribe(
      (res) => {
        this.ngxService.stop();
        let response: any = res.data;


        //Manage Basic Pay key
        response.user_salary_details.forEach((el: any) => {
          console.log(el.company_id, el.basicPay)
          console.log(el.basicPay !== undefined && el.basicPay !== null && el.basicPay !== "")
          let basicPay = {}
          if (el.basicPay !== undefined && el.basicPay !== null && el.basicPay !== "") {
            Object.values(el.basicPay).forEach((basicel: any) => {
              basicPay = basicel
            })
            el.basicPay = basicPay
          }
          else {
            el.basicPay = 0
          }
        })


        //return arr.reduce((acc: any, val: any) => acc + val);

        this.tableRecord = response.user_salary_details
        this.getReportingManager(response.user_salary_details);
        console.log(response.user_salary_details)


        if (res.success == true) {
          this.dataSource = new MatTableDataSource([
            ...response.user_salary_details,
          ]);
          this.csvexcelDataSource = new MatTableDataSource([
            ...response.user_salary_details,
          ]);

          this.average_salary = response.Avg_Salary;
          this.total_salary = response.Total_Salary


          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          this.csvexcelDataSource.sort = this.sort;


          let lateEmpCount = response.user_salary_details
            .sort((a, b) => parseInt(b.lateCount) - parseInt(a.lateCount))
            .splice(0, 5);
          let leaveEmpCount = response.user_salary_details
            .sort((a, b) => parseInt(b.leaveCount) - parseInt(a.leaveCount))
            .splice(0, 5);
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


  showTab() {
    this.tableFirst = true;
    this.tableSecond = false;
  }
  showCal() {
    this.tableFirst = false;
    this.tableSecond = true;
  }
}
