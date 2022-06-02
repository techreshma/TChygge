import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexNoData, ApexStroke, ChartComponent } from "ng-apexcharts";
import 'chart.piecelabel.js';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip
} from "ng-apexcharts";
import { hover } from '@syncfusion/ej2-angular-schedule';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  color: string[];
  dataLabels: ApexDataLabels;
  noData: ApexNoData,
  stroke: ApexStroke,
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {
  @Input() data: string;

  // Doughnut
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor() { }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    graphData['show'] = true

    console.log(graphData.percentage)
    //Here We Can Manage zero Percentage Case
    let percentageCheckedCount: any = 0;
    graphData.percentage.forEach((el: any) => {
      if (el == 0) { percentageCheckedCount++; }
    })
    console.log(percentageCheckedCount, graphData.percentage.length, percentageCheckedCount == graphData.percentage.length);
    let dataLabels: any = {
      enabled: true
    };
    if (percentageCheckedCount == graphData.percentage.length) {
      graphData.percentage = [100];
      graphData.label = ["0%"];
      dataLabels.enabled = false;
    }



    this.chartOptions = {


      series: graphData.percentage,
      chart: {
        width: graphData.width ? graphData.width : 250,
        type: "donut"
      },
      labels: graphData.label,
      dataLabels: dataLabels,
      fill: {
        type: "gradient",
      },


      legend: {
        // show: graphData.dataLabels ? graphData.dataLabels : false,

        position: 'right',
        offsetY: 5,
        height: 230,
        labels: graphData.label,
        onItemHover: {
          highlightDataSeries: false
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }
      ],

    };
  }

}


