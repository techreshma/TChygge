import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
  dataLabels: ApexDataLabels;
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
    console.log(graphData)
    graphData['show'] = true
    this.chartOptions = {
      series: graphData.percentage,
      chart: {
        width: graphData.width ? graphData.width : 250,
        type: "donut"
      },
      labels: graphData.label,
      dataLabels: {
        enabled: true
      },
      fill: {
        type: "gradient",
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
      colors: graphData.colors,

    };
  }
}

