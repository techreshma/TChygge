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
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() data: any;

  constructor() {
  }

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "Metric1",
          data: this.generateData(10, {
            min: 0,
            max: 40
          })
        },
        {
          name: "Metric2",
          data: this.generateData(2, {
            min: 40,
            max: 100
          })
        },
        {
          name: "Metric3",
          data: this.generateData(3, {
            min: 100,
            max: 110
          })
        },
        {
          name: "Metric4",
          data: this.generateData(4, {
            min: 110,
            max: 120
          })
        },
        {
          name: "Metric5",
          data: this.generateData(5, {
            min: 120,
            max: 125
          })
        },
      ],
      chart: {
        height: 350,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: this.data.title
      }
    };
  }

  generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    console.log(series)
    return series;
  }
}


