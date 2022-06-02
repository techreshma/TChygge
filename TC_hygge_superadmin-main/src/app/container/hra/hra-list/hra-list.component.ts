import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';
import jsPDF from 'jspdf';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';
import { HraViewComponent } from '../hra-view/hra-view.component';
@Component({
  selector: 'app-hra-list',
  templateUrl: './hra-list.component.html',
  styleUrls: ['./hra-list.component.scss']
})
export class HraListComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'questions', 'attempted', 'employees', 'status'];
  userComapanyChart: string = JSON.stringify({ label: [], percentage: [{ name: 'Company', data: [10, 50, 30, 75, 80] }, { name: 'User', data: [30, 70, 20, 95, 10] }], colors: ['#0190FF', '#ff9b44'], height: 250, seriesType: true });
  wellnessDistributionGraphData: any; //Donut
  genderBasedGraphData: any; //Donut
  hraScoreGuageData: any; // Speedometer
  hraScoreImprovement: any; //card
  empParticipatingProgram: any; //card
  aggreegateCategoriesGraphata: any //Horizontal bar
  agreegatedRiskGraphata: any //Horizontal bar
  bmiAgeGraphdata: any;
  bmiGenderGraphdata: any;
  hraRadarData: any //Radar traingle
  redinessArray: any;
  bmiType: any = 'age'
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  readinessObj: any = {
    underweight: 'circle_lightred',
    normal: 'circle_red',
    overweight: 'circle_yellow',
    obese: 'circle_lightgreen',
    mobidyobese: 'circle_green'
  }
  
  
  public radarChartType: ChartType = 'radar';
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  responseData: any = [];
  accessPermission: boolean;

  totalQuestions: number = 26;
  imgPath: any = environment.apiBaseUrl;
  cloneResponseArray: any = [];
  constructor(
    public router: Router,
    public _access: AccessServiceService,
    public dialog: MatDialog,
    public ngxService: NgxUiLoaderService,
    public _snackBar: MatSnackBar,
    public _api: CommonServiceService
  ) {
  }

  ngOnInit(): void {
    // getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getList();
    this.loadDashboard();
  }

  // Get HRA List
  async getList() {
    this.ngxService.start();
    await (this._api.hraList().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          response.data[i]['id'] = i;
        }
        
        this.cloneResponseArray = response.data;
        for (let item of this.responseData) {
          item.columnArray = JSON.parse(item.columnArray);
          item.optionArray = JSON.parse(item.optionArray);
          item.rowArray = JSON.parse(item.rowArray);
          item.sliderOption = JSON.parse(item.sliderOption);
          item.subQuestion = JSON.parse(item.subQuestion)
        }

        console.log("Working" , this.responseData)

        this.responseData = [...new Map(this.cloneResponseArray.map((item: any) => [item["title"], item])).values()];
         
        this.responseData.forEach((element:any , index:any)=>{
          element['sno'] = index + 1 
        })
       
        this.dataSource = new MatTableDataSource([...this.responseData]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  //Get Agreegated Report Data and Download PDF
  //async getAgreegatedReport() {
  getAgreegatedReport() {
    this.downloadAsPDF()
    // this.ngxService.start();
    // await (this._api.companyReportCalculation().subscribe(res => {
    //   const response: any = res;
    //   if (response.success == true) {
    //     console.log(response.data);
    //     this.downloadAsPDF();
    //     this.ngxService.stop();
    //   } else {
    //   }
    // }, err => {
    //   const error = err.error;
    //   this.ngxService.stop();
    // }));
  }
  //Get Agreegated Report Data and Download PDF

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

  // open hra question preview modal
  openPreviewModal() {
    const dialogRef = this.dialog.open(HraViewComponent, {
      width: '90%',
      height: '90%',
      data: {
        hraP: JSON.stringify(this.responseData)
      }
    },
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // this.getRole();
    });
  }
  // Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // alert message after api response success
  openSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-alert']
    });
  }
  // alert message after api response failure
  openErrrorSnackBar(msg) {
    this._snackBar.open(msg, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['failure-alert']
    });
  }

  getPercentage(at) {
    return ((at / this.totalQuestions) * 100)
  }

  //heightlight row
  getClass(row) {
    if (row.dependentQuestionId != 0) {
      return true
    } else {
      return false
    }
  }

  // Delete Company
  async deleteQuestion(id) {
    this.ngxService.start();
    const formData = {
      questionId: id,
    };
    await (this._api.deleteHra(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.getList();
      } else {
        this.openErrrorSnackBar(response.message);
      }


      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));

  }

  // confirm message
  confirmDialog(id): void {
    const message = `Are you sure you want to delete this?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteQuestion(id);
      }
      else {
        this.getList()
      }
    });
  }
  // Download list in CSV
  export_table_to_csv() {
    this.ngxService.start();
    const html = document.getElementById('csvTable');
    let csv = [];
    let rows = html.querySelectorAll('table tr');

    for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll('td, th');

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].textContent);
      }

      csv.push(row.join(','));
    }

    // Download CSV
    this.download_csv(csv.join('\n'), 'Hra-List.csv');
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

  async loadDashboard() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await (this._api.healthWellnessDashboard().subscribe((res: any) => {
      const response: any = res;

      console.log(response)
      if (response.success) {
       
        this.wellnessDistributionGraphData = JSON.stringify({
          label: response.data.userwellness_distribution.map((item) => item.name),
          percentage: response.data.userwellness_distribution.map((item) => item.count),
          width: 250,
        });
        console.log(response.data)
        this.genderBasedGraphData = JSON.stringify({
          label: response.data.count_gender.map((item) => item.gender),
          percentage: response.data.count_gender.map((item) => item.count),
          width: 250,
        });


        this.hraScoreGuageData = JSON.stringify({
          label: '',
          percentage: response.data.hra_point.total,
          height: 200,
        });


        this.hraScoreImprovement = response.data.Avg_hraScoreImprovement;
        
        console.log(response.data.employees_participating)
        this.empParticipatingProgram = response.data.employees_participating[0].count;

        this.aggreegateCategoriesGraphata = JSON.stringify({
          label: response.data.agreegatedCategories_score.map((item) => item.name),
          percentage: response.data.agreegatedCategories_score.map((item) => item.score),
          width: 250,
        });


        this.agreegatedRiskGraphata = JSON.stringify({
          label: response.data.agreegatedRisk_score.map((item) => item.name),
          percentage: response.data.agreegatedRisk_score.map((item) => item.score),
          width: 250,
        });

        console.log(response.data.hraRadarData)
        this.hraRadarData = JSON.stringify({
          label: ['Lifestyle', 'Body', 'Mind'],
          percentage: [
            [
              response.data.hra_point.lifestyle,
              response.data.hra_point.body,
              response.data.hra_point.mind
            ],
            [
              response.data.hra_point.body,
              response.data.hra_point.mind,
              response.data.hra_point.lifestyle
            ],
            [
              response.data.hra_point.mind,
              response.data.hra_point.lifestyle,
              response.data.hra_point.body,
            ],
          ],
          height: 250,
        });

        this.redinessArray = response.data.employeeReadiness; //Array

        this.bmiAgeGraphdata = JSON.stringify({
          label: response.data.bmiAge.map((item) => item.name),
          percentage: response.data.bmiAge.map((item) => item.value),
          width: 250,
        });

        this.bmiGenderGraphdata = JSON.stringify({
          label: response.data.bmiGender.map((item) => item.gender),
          percentage: response.data.bmiGender.map((item) => item.value),
          width: 250,
        });



      }
      else {

      }
    }, err => {
    }))
  }

}
