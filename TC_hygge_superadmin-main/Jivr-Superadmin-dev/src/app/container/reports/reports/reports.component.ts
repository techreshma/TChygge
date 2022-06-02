import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  list:any [];
  constructor() { }

  ngOnInit(): void {
    let colors = ['#3F51B5', ' #FFAA00', '#C86CE6', '#FF4081', '#15C1DC','#1ec41e']
    this.list = [{icon:'checklist',color:colors[0],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[1],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[2],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[3],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[4],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[5],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[0],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[1],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[2],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[3],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[4],title:'Attendance',route:'/attendance-report'},
    {icon:'checklist',color:colors[5],title:'Attendance',route:'/attendance-report'}]
  }
}