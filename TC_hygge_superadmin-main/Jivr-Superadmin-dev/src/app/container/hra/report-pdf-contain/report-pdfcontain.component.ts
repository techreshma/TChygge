import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import jspdf, { jsPDF } from 'jspdf';


@Component({
  selector: 'app-report-pdf-contain',
  templateUrl: './report-pdfcontain.component.html',
  styleUrls: ['./report-pdfcontain.component.scss']
})
export class ReportPdfContainComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  hraEngagmentGraphData: any;

  responseData: any;
  maleGraphData: any;
  femaleGraphData: any;
  hraEngagementGraphData: any;
  bmititle = {
    anorexia: "Anorexia",
    underweight: "Under Weight",
    healthy: "Healthy",
    overweight: "Over Weight",
    obese: "Obese",
    morbidObese: "Morbid Obese"
  }
  preventiveHealthtitle = {
    lowRiskTablePH: "Low Risk",
    moderateRiskTablePH: "Moderate Risk",
    highRiskTablePH: "High Risk",
  }
  tobaccotitle = {
    lowRiskTableT: "Low Risk",
    moderateRiskTableT: "Moderate Risk",
    highRiskTableT: "High Risk",
  }
  physicalActivitytitle = {
    lowRiskTablePA: "Low Risk",
    moderateRiskTablePA: "Moderate Risk",
    highRiskTablePA: "High Risk",
  }
  sleeptitle = {
    lowRiskTableS: "Low Risk",
    moderateRiskTableS: "Moderate Risk",
    highRiskTableS: "High Risk",
  }
  occupationalHealthtitle = {
    lowRiskTableOH: "Low Risk",
    moderateRiskTableOH: "Moderate Risk",
    highRiskTableOH: "High Risk",
  }
  heartRisktitle = {
    lowRiskTableHR: "Low Risk",
    moderateRiskTableHR: "Moderate Risk",
    highRiskTableHR: "High Risk",
  }
  diabetesRisktitle = {
    lowRiskTableDR: "Low Risk",
    moderateRiskTableDR: "Moderate Risk",
    highRiskTableDR: "High Risk",
  }
  obesityRisktitle = {
    anorexiaOR: "Anorexia",
    underweightOR: "Under Weight",
    healthyOR: "Healthy",
    overweightOR: "Over Weight",
    obeseOR: "Obese",
    morbidObeseOR: "Morbid Obese"
  }
  mentalWellbeingtitle = {
    lowRiskTableMW: "Low Risk",
    moderateRiskTableMW: "Moderate Risk",
    highRiskTableMW: "High Risk",
  }

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
  filter: any[];
  canvas: any = ''
  
  //assetsSuffix: any = environment.production ? '../../../assets' : 'assets'
  assetsSuffix: any = 'assets'
  imageUrl_family: any = this.assetsSuffix + "/img/family.png";
  imageUrl_health: any = this.assetsSuffix + "/img/health.jpg";
  public radarChartType: ChartType = 'radar';
  hraRetakeGraphData: any;
 
  
  constructor(
    public api: CommonServiceService,
    public router: Router,
    public ngxService: NgxUiLoaderService,
  ) {

    let url = this.router.url.split('/');
    let id = url.pop();
    this.loadData(id);
  }

  ngOnInit(): void {
    this.getConverterUrl();
    this.convertHtmlToCanvas();
  }

  loadData(id: string) {
    this.ngxService.start();
    let request = {
      company_id: id
    }
    this.api.superCompanyCalculation(request).subscribe((response: any) => {
      const res: any = response
      if (res.success) {
        this.responseData = res.data;
        this.hraEngagmentGraphData = JSON.stringify({
          label: Object.keys(this.responseData.hraEngagement),
          percentage: Object.values(this.responseData.hraEngagement),
          width: 350,
          colors: ["#c1afe6"],
        });


        this.maleGraphData = JSON.stringify({
          label: response.data.male.map((item: { ageBracket: any; }) => item.ageBracket),
          percentage: response.data.male.map((item: { value: any; }) => item.value),

          width: 350,
          colors: ["#c1afe6"],
        });

        this.femaleGraphData = JSON.stringify({
          label: response.data.female.map((item: { ageBracket: any; }) => item.ageBracket),
          percentage: response.data.female.map((item: { value: any; }) => item.value),
          width: 350,
          colors: ["#c1afe6"],
        });

        //#region Bmi Donut Chart Graph Logic Start
        let filterBmiElement = ['overweight', 'obese', 'underweight', 'healthy'];
        let bmiObject: any = {};
        filterBmiElement.forEach((el: any) => {
          bmiObject[el] = this.responseData.bmi[el]
        })
        this.bmiGraph = JSON.stringify({
          label: Object.keys(bmiObject),
          percentage: Object.values(bmiObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion

        //#region PreventiveHealth Donut Chart Graph Logic Start
        let filterPreventiveHealthElement = ['highRisk', 'lowRisk', 'moderateRisk'];
        let preventiveHealthObject: any = {};
        filterPreventiveHealthElement.forEach((el: any) => {
          preventiveHealthObject[el] = this.responseData.preventiveHealth[el]
        })
        this.preventiveHealthGraph = JSON.stringify({
          label: Object.keys(preventiveHealthObject),
          percentage: Object.values(preventiveHealthObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region tobacco Donut Chart Graph Logic Start
        let filtertobaccoElement = ['nonSmokers', 'smokers'];
        let tobaccoObject: any = {};
        filtertobaccoElement.forEach((el: any) => {
          tobaccoObject[el] = this.responseData.tobacco[el]
        })
        this.tobaccoGraph = JSON.stringify({
          label: Object.keys(tobaccoObject),
          percentage: Object.values(tobaccoObject),
          width: 350,
          colors: ["#c1afe6", '#e3dfed'],
        })
        //#endregion
        //#region alcohol Donut Chart Graph Logic Start
        let filteralcoholElement = ['alcoholUnit_1Or2', 'alcoholUnit_3OrMore', 'nonDrinkers'];
        let alcoholObject: any = {};
        filteralcoholElement.forEach((el: any) => {
          alcoholObject[el] = this.responseData.alcohol[el]
        })
        this.alcoholGraph = JSON.stringify({
          label: Object.keys(alcoholObject),
          percentage: Object.values(alcoholObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region diet Donut Chart Graph Logic Start
        let filterdietElement = ['unhealthy', 'wellBalanced',];
        let dietObject: any = {};
        filterdietElement.forEach((el: any) => {
          dietObject[el] = this.responseData.diet[el]
        })
        this.dietGraph = JSON.stringify({
          label: Object.keys(dietObject),
          percentage: Object.values(dietObject),
          width: 350,
          colors: ["#c1afe6", '#e3dfed'],
        })
        //#endregion

        //#region physicalActivity Donut Chart Graph Logic Start
        let filterphysicalActivityElement = ['moderatelyActive', 'notSure', 'sedentary'];
        let physicalActivityObject: any = {};
        filterphysicalActivityElement.forEach((el: any) => {
          physicalActivityObject[el] = this.responseData.physicalActivity[el]
        })
        this.physicalActivityGraph = JSON.stringify({
          label: Object.keys(physicalActivityObject),
          percentage: Object.values(physicalActivityObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region sleep Donut Chart Graph Logic Start
        let filtersleepElement = ['highRisk', 'lowRisk', 'moderateRisk'];
        let sleepObject: any = {};
        filtersleepElement.forEach((el: any) => {
          sleepObject[el] = this.responseData.sleep[el]
        })
        this.sleepGraph = JSON.stringify({
          label: Object.keys(sleepObject),
          percentage: Object.values(sleepObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region occupationalHealth Donut Chart Graph Logic Start
        let filteroccupationalHealthElement = ['highRisk', 'lowRisk', 'moderateRisk'];
        let occupationalHealthObject: any = {};
        filteroccupationalHealthElement.forEach((el: any) => {
          occupationalHealthObject[el] = this.responseData.occupationalHealth[el]
        })
        this.occupationalHealthGraph = JSON.stringify({
          label: Object.keys(occupationalHealthObject),
          percentage: Object.values(occupationalHealthObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region heartRisk Donut Chart Graph Logic Start
        let filterheartRiskElement = ['highRisk', 'lowRisk', 'moderateRisk'];
        let heartRiskObject: any = {};
        filterheartRiskElement.forEach((el: any) => {
          heartRiskObject[el] = this.responseData.heartRisk[el]
        })
        this.heartRiskGraph = JSON.stringify({
          label: Object.keys(heartRiskObject),
          percentage: Object.values(heartRiskObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region diabetesRisk Donut Chart Graph Logic Start
        let filterdiabetesRiskElement = ['highRisk', 'lowRisk', 'moderateRisk'];
        let diabetesRiskObject: any = {};
        filterdiabetesRiskElement.forEach((el: any) => {
          diabetesRiskObject[el] = this.responseData.diabetesRisk[el]
        })
        this.diabetesRiskGraph = JSON.stringify({
          label: Object.keys(diabetesRiskObject),
          percentage: Object.values(diabetesRiskObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region obesityRisk Donut Chart Graph Logic Start
        let filterobesityRiskElement = ['overweight', 'obese', 'underweight', 'healthy'];
        let obesityRiskObject: any = {};
        filterobesityRiskElement.forEach((el: any) => {
          obesityRiskObject[el] = this.responseData.obesityRisk[el]
        })
        this.obesityRiskGraph = JSON.stringify({
          label: Object.keys(obesityRiskObject),
          percentage: Object.values(obesityRiskObject),
          width: 350,
          colors: ["#c1afe6", '#c7b3f2', '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        //#region mentalWellbeing Donut Chart Graph Logic Start
        let mentalWellbeingObject: any = {}
        let mentalWellbeingArray: any = this.responseData.mentalWellbeing.tableDataMentalWellbeing;
        mentalWellbeingArray.forEach((el: any) => {
          mentalWellbeingObject[Object.keys(el)[0]] = Object.values(el)[0]['total']
        })

        this.mentalWellbeingGraph = JSON.stringify({
          label: Object.keys(mentalWellbeingObject),
          percentage: Object.values(mentalWellbeingObject),
          width: 350,
          colors: ["#c1afe6", '#d1c8e6', '#e3dfed'],
        })
        //#endregion
        this.hraRetakeGraphData = JSON.stringify({
          label: Object.keys(this.responseData.hraRetake),
          percentage: Object.values(this.responseData.hraRetake),
          width: 350,
          colors: ["#c1afe6"],
        });
        setTimeout(() => {
          this.downloadAsPDF();
          this.ngxService.stop();
        }, 5000);
      }
    })
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

  //#region Convert image path into baseurl
  getBase64ImageFromURL(url: string) {
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

  downloadAsPDF() {
    let data = document.getElementById('pdfTable') as HTMLElement;  //Id of the table
    html2canvas(data).then(canvas => {
     // Few necessary setting options  
      let imgWidth = 210;
      let pageHeight = 297;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', [this.canvas.height, 210]); // A4 size page of PDF 
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('download.pdf'); // Generated PDF  
      this.router.navigate(['/hra-reports'])
    });
  }
  //#endregion This function is use for genrate pdf

}

function id(id: any) {
  throw new Error('Function not implemented.');
}