import { Component, Input, OnInit, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
@Input() data:string;
@ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
  }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    this.chartOptions = {
      series: graphData.seriesType?
      graphData.percentage:[
        {
          name: graphData.dataName,
          data: graphData.percentage
        }
      ],
      chart: {
        height: graphData.height?graphData.height:350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: graphData.colors,
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: graphData.dataName,
        align: "left"
      },
      grid: {
        borderColor: graphData.colors[0],
        row: {
          colors: [graphData.colors[0], "transparent"], // takes an array which will be repeated on columns
          opacity: 0
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: graphData.label,
        // title: {
        //   text: graphData.mainLabel?graphData.mainLabel:'Month'
        // },
        title: {
         // text: graphData.mainLabel?graphData.mainLabel:'Month'
          text: ''
        }
      },
      yaxis: {
        title: {
          //text: "Points"
          text: ''
        },
        min: 0,
        max: 100
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }
}
