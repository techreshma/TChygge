import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';


@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  @Input() data:string;

  // pie
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartColors: Color[] = []
  public pieChartType: ChartType = 'pie';
  public barChartLegend = false
  constructor() { }

  ngOnInit(): void {
    let graphData = JSON.parse(this.data)
    this.pieChartData = graphData.percentage;
    this.pieChartColors =  [{ // all colors in order
      backgroundColor: graphData.colors
    }];
    this.pieChartLabels = graphData.label
    // for(let item of graphData.colors){
    //   this.pieChartColors.push({
    //     borderColor: item,
    //     backgroundColor: item
    //   })
    // }

  }
}
