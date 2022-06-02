import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageEvent: PageEvent;
  pdfMake: any;

  pdfDynamicReport: any;
  canvasHtmlContent: any;
  canvas: any = ''

  //#region PDF Dynamic data
  maleGraphData: any;
  femaleGraphData: any;
  hraEngagmentGraphData: any;
  hraRetakeGraphData: any;


  bmiGraph: any;
  tobaccoGraph: any;
  alcoholGraph: any;
  dietGraph: any;
  physicalActivityGraph: any;
  preventiveHealthGraph: any;
  sleepGraph: any;
  occupationalHealthGraph: any;
  heartRiskGraph: any;
  diabetesRiskGraph: any;
  obesityRiskGraph: any;
  mentalWellbeingGraph: any;
  //#endregion PDF Dynamic data

  // set header column
  displayedColumns: string[] = ['picture', 'date', 'company', 'status'];
  //displayedColumns: string[] = ['picture','name', 'date','company' ,'status'];

  // set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  responseData: any = {};
  accessPermission: boolean;

  totalQuestions: number = 26;
  imgPath: any = environment.apiBaseUrl;
  isLoadData: boolean = false;

  assetsSuffix: any = 'assets'
  imageUrl_family: any = this.assetsSuffix + "/img/family.png";
  imageUrl_health: any = this.assetsSuffix + "/img/health.jpg";
  constructor(public router: Router, public _access: AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // getting access permission
    this.accessPermission = this._access.getRouteAccess('User roles', JSON.parse(localStorage.getItem('userData')).moduleAccess);
    this.getConverterUrl();
    this.getList(0, 10);
  }
  paginationChange(e) {
    this.pageEvent = e
    console.log(this.pageEvent)
    this.getList(e.pageIndex, e.pageSize);
  }


  convertHtmlToCanvas() {
    const el: any = document.querySelector('#pdfTable');
    el.style.display = "block";
    html2canvas(el, {}).then((canvas) => {
      el.style.display = "none";
      this.canvas = canvas
    })
  }


  // Get HRA List
  async getList(page, pagination) {
    let formData = {
      "page": page,
      "pagination": pagination
    }
    this.ngxService.start();
    await (this._api.showHraCompanyList().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.dataSource = new MatTableDataSource([...response.data]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.length = response.length;
        console.log(this.dataSource);
      } else {
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

  }

  async CompanyReportPdf(id: any) {
    console.log("CompanyId" , id)
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



  // get attempted percentage
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

  //Get Agreegated Report Data and Download PDF
  async getAgreegatedReport(id) {

    console.log(id);
    let data = {
      company_id: id,
    };
    this.ngxService.start();
    await (this._api.superCompanyCalculation(data).subscribe(res => {
      const response: any = res;
      if (response.success == true) {
        this.ngxService.stop();
        this.getAgreegatedData(response.data)
      } else {
      }
    }, err => {
      this.ngxService.stop();
    }));


  }
  //Get Agreegated Report Data and Download PDF

  async getConverterUrl() {
    this.imageUrl_family = await this.getBase64ImageFromURL(this.imageUrl_family)
    this.imageUrl_health = await this.getBase64ImageFromURL(this.imageUrl_health)
  }

  //#region Convert image path into baseurl
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  //#endregion

  //#region Function for Agreegated Report response sepration
  getAgreegatedData(pdfData: any) {
    console.log(pdfData)
    /*
      maleGraphData: any;
  femaleGraphData: any;
  hraEngagmentGraphData: any;
  hraRetakeGraphData: any;
  
    */
    this.maleGraphData = JSON.stringify({
      label: pdfData.male.map((item) => item.ageBracket),
      percentage: pdfData.male.map((item) => item.value),
      colors: ['#ab7dfa'],
    });
  }
  //#endregion Function for Agreegated Report response sepration

  //#region This function is use for genrate pdf
  downloadAsPDF() {
    this.ngxService.start();
    let width: any = '';
    let height: any = '';
    let pdf = new jspdf("p", "px", [this.canvas.height, this.canvas.width]);

    //then we get the dimensions from the 'pdf' file itself
    width = pdf.internal.pageSize.getWidth();
    height = pdf.internal.pageSize.getHeight();
    pdf.addImage(this.canvas, 'PNG', 0, 0, width, height);
    pdf.save("download.pdf");
    this.ngxService.stop();
  }
  //#endregion This function is use for genrate pdf

  bmiTypeFunction(type: any) {
    console.log(type)
  }

}

