import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

import domtoimage from 'dom-to-image';





@Component({
  selector: 'app-healthwellness',
  templateUrl: './healthwellness.component.html',
  styleUrls: ['./healthwellness.component.scss']
})
export class HealthwellnessComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
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
  bmiType: any = 'age';
  pdfMake: any;

  pdfDynamicReport: any;

  readinessObj: any = {
    underweight: 'circle_lightred',
    normal: 'circle_red',
    overweight: 'circle_yellow',
    obese: 'circle_lightgreen',
    mobidyobese: 'circle_green'
  }

  assetsSuffix: any = environment.production ? '../../../assets' : 'assets'
  imageUrl_family: any = this.assetsSuffix + "/img/family.png";
  imageUrl_health: any = this.assetsSuffix + "/img/health.jpg";


  canvasHtmlContent: any;
  canvas: any = ''

  //#region PDF Dynamic data
  maleGraphData: any;
  femaleGraphData: any;
  hraEngagmentGraphData: any;
  hraRetakeGraphData: any;
  //#endregion PDF Dynamic data

  constructor(
    public _api: CommonServiceService,
    public ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.getConverterUrl();
    this.getAgreegatedReport();
    this.loadDashboard();
    this.convertHtmlToCanvas();
  }

  convertHtmlToCanvas() {
    const el: any = document.querySelector('#pdfTable');
    el.style.display = "block";
    html2canvas(el, {}).then((canvas) => {
      el.style.display = "none";
      this.canvas = canvas
    })
  }

  async getConverterUrl() {
    this.imageUrl_family = await this.getBase64ImageFromURL(this.imageUrl_family)
    this.imageUrl_health = await this.getBase64ImageFromURL(this.imageUrl_health)
  }

  async loadDashboard() {
    let formData = {
      company_Id: JSON.parse(localStorage.getItem('userData')).company_id,
    };
    await (this._api.healthWellnessDashboard(formData).subscribe((res: any) => {
      const response: any = res;

      console.log(response)
      if (response.success) {
        this.wellnessDistributionGraphData = JSON.stringify({
          label: response.data.userwellness_distribution.map((item) => item.name),
          percentage: response.data.userwellness_distribution.map((item) => item.count),
          width: 250,
        });

        this.genderBasedGraphData = JSON.stringify({
          label: response.data.responded_gender.map((item) => item.name),
          percentage: response.data.responded_gender.map((item) => item.count),
          width: 250,
        });


        this.hraScoreGuageData = JSON.stringify({
          label: '',
          percentage: response.data.hra_point.total,
          height: 200,
        });


        this.hraScoreImprovement = response.data.averageHrascore_improvment;

        this.empParticipatingProgram = response.data.empParticipanting_program;

        this.aggreegateCategoriesGraphata = JSON.stringify({
          label: response.data.agreegatedCategories.map((item) => item.name),
          percentage: response.data.agreegatedCategories.map((item) => item.score),
          width: 250,
        });


        this.agreegatedRiskGraphata = JSON.stringify({
          label: response.data.agreegatedRisk.map((item) => item.name),
          percentage: response.data.agreegatedRisk.map((item) => item.score),
          width: 250,
        });


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

  //Get Agreegated Report Data and Download PDF
  async getAgreegatedReport() {
    this.ngxService.start();
    await (this._api.companyReportCalculation().subscribe(res => {
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