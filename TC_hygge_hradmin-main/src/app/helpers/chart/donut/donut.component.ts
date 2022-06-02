import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit {

  constructor() { }

  public piedata: Object[];
  public startAngle: number;
  public endAngle: number;
  public datalabel: Object;
  public legendSettings: Object;
  ngOnInit(): void {
      this.startAngle = 270;
      this.endAngle = 90;
      this.datalabel = { visible: true, name: 'text', position: 'Outside' };
      this.piedata = [{name: 'Label1' , value: 30}];
       this.legendSettings = {
          visible: false
      };
  }


}
