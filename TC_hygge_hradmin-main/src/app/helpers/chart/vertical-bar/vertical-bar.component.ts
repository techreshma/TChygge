import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-vertical-bar',
  templateUrl: './vertical-bar.component.html',
  styleUrls: ['./vertical-bar.component.scss']
})
export class VerticalBarComponent implements OnInit {
  @Input() data:string;

  // bar
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartData: ChartDataSets[] = [];
  public barChartColors: Color[] = []
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false
  constructor() { }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    this.barChartLabels = ['Status']
    this.barChartData = [{data:[graphData.percentage[0]], label:graphData.label[0]},
                        {data:[graphData.percentage[1]], label:graphData.label[1]}];
    console.log(this.barChartData)
    this.barChartColors =  [
      { backgroundColor: graphData.colors[0] },
      { backgroundColor: graphData.colors[1] },
    ];

  }

}
