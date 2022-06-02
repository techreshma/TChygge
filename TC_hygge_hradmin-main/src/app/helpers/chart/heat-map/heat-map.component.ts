import { Component, Input, OnInit, ViewChild } from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors: any;
};


@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  @Input() data:string;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {

  }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    console.log(graphData)
    this.chartOptions = {
      series: graphData.data,
      chart: {
        height: 200,
        type: "heatmap"
      },
      dataLabels: {
        enabled: true
      },
      colors: [graphData.color],
      title: {
        text: ""
      }
    };
  }

}
