import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexFill,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.scss']
})
export class HorizontalBarComponent implements OnInit {
  @Input() data:string;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  // bar
  constructor() { }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    this.chartOptions = {
      series: [
        {
          name: "basic",
          data: graphData.percentage
        }
      ],
      chart: {
        type: "bar",
        height:graphData.height || 250,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      legend:{
        show: graphData.dataLabels?graphData.dataLabels:false
      },
      dataLabels: {
        enabled: graphData.dataLabels?graphData.dataLabels:false
      },
      xaxis: {
        categories: graphData.label
      }
    };

  }

}
