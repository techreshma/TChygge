import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  role: number;
  nameofplan: string;
  member: number;
  tableofbenefit: string;
  network: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {role: 0, nameofplan: "Plan Name Goes", member: 35, tableofbenefit: "View Benifit",network:"link",action:"Notification Area"},
  {role: 0, nameofplan: "Plan Name Goes Here", member: 35, tableofbenefit: "View Benifit",network:"link",action:"Notification Area"},
  {role: 0, nameofplan: "Plan Name Goes",  member: 35, tableofbenefit: "View Benifit",network:"link",action:"Notification Area"},
  {role: 0, nameofplan: "Plan Name Goes Here", member: 35, tableofbenefit: "View Benifit",network:"link",action:"Notification Area"},
  {role: 0, nameofplan: "Plan Name Goes ", member: 35, tableofbenefit: "View Benifit",network:"link",action:"Notification Area"},
];




@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['role', 'nameofplan', 'member', 'tableofbenefit', 'network', 'action'];
  dataSource = ELEMENT_DATA;

}
