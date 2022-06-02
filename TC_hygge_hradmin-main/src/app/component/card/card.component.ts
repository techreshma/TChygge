import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() title: any;
  @Input() footer: any;
  @Input() centertext: any;
  @Input() children: TemplateRef<any>;
  @Input() checkGraphyType: boolean = false;

  @Input() CardHeight: any = '';
  @Input() isDefault: boolean = false;
  @Input() isLineChart: boolean = false;

  constructor() { }

  ngOnInit(): void {
    //console.log(this.children)
  }
}
