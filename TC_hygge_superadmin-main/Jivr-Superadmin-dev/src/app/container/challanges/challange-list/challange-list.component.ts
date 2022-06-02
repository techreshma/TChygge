import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChallangeDetailComponent } from '../challange-detail/challange-detail.component';
@Component({
  selector: 'app-challange-list',
  templateUrl: './challange-list.component.html',
  styleUrls: ['./challange-list.component.scss']
})

export class ChallangeListComponent implements OnInit {
  // set header column
  displayedColumns: string[] = ['challenge_image', 'challenege_Name', 'point', 'acceptedBy', 'expiry', 'action'];

  //set static data for table
  dataSource = new MatTableDataSource([]);

  // table sorting and pagination
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  imgPath = environment.apiBaseUrl;
  graphData: any;
  departmentGraph: any
  heatGraph: any;
  responseData: any = [];
  accessPermission: boolean;
  departmentData: any = [];
  activeChallanges: number = 0;
  totalParticipant: number = 0;
  graphDetail: any;
  graphMale: number = 0;
  graphFemale: number = 0;
  colors = ['#3F51B5', '#5363BC', '#6876C4', '#7C88CB', '#5363BC', '#6876C4', '#7C88CB', '#BAC0E1', '#CED2E8', '#5363BC', '#7C88CB', '#A5ADDA', '#BAC0E1', '#CED2E8', '#E3E5F0', '#F7F7F7', '#3F51B5', '#5363BC', '#6876C4', '#7C88CB', '#5363BC', '#6876C4', '#7C88CB', '#BAC0E1', '#CED2E8', '#5363BC', '#7C88CB', '#A5ADDA', '#BAC0E1', '#CED2E8', '#E3E5F0', '#F7F7F7']
  constructor(public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getChallangesList();
    this.getChallangesGraphData()
  }

  // challanges list
  async getChallangesList() {
    this.ngxService.start();
    await (this._api.getchallanges().subscribe(res => {
      this.ngxService.stop();
      const response = res;
      this.responseData = response.data;

      console.log(this.responseData)
      this.responseData.forEach((el: any) => {

      })

      /*received: response.data.reduce(function (sum, received) {
            return sum + received.totalUserSubmission ;
          }, 0)*/

      let count = 0
      let gData = [{
        name: "",
        data: []
      }]

      //actin_Required

      let totalChallenges: any = this.responseData ? this.responseData.length : 0
      let disabledChallenge: any = 0;
      let enabledChallenge: any = 0;
      let totalParticipantArray: any = [];


      for (let item of this.responseData) {
        item.actin_Required === 0 ? disabledChallenge++ : enabledChallenge++;
        item.acceptedByAcceptUser ? totalParticipantArray.push(item.acceptedByAcceptUser) : [];
        // if (item.actin_Required == 1) {  
        //   this.activeChallanges++;
        //   this.totalParticipant += Number(item.acceptedByAcceptUser)
        // }
        // if(count > 8){
        //gData[0].data.push({ x: item.challenege_Name, y: item.acceptedByAcceptUser ? item.acceptedByAcceptUser : 0 })
        // }else{
        //   gData[1].data.push({x:item.challenege_Name,y:item.acceptedByAcceptUser?item.acceptedByAcceptUser:0})
        // }
        //count++;

      }

      console.log("Total participant", totalParticipantArray)

      this.activeChallanges = enabledChallenge;
      if ((gData[0].data.filter(item => item.y > 0)).length > 0) {
        this.heatGraph = JSON.stringify({ data: gData, color: '#3F51B5' })
      }
      this.dataSource = new MatTableDataSource([...response.data])
      this.dataSource.sort = this.sort;
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }



  // graph data
  async getChallangesGraphData() {
    let formData = {
      "company_Id": JSON.parse(localStorage.getItem('userData')).company_id
    }
    this.ngxService.start();
    await (this._api.graphDetailChallenege(formData).subscribe(res => {
      this.ngxService.stop();
      const response = res;
      this.graphDetail = response.data
      let Department: any = [];
      let DepartmentCount: any = [];
      for (let item of this.graphDetail) {
        this.graphMale += item.male;
        this.graphFemale += item.female
        // for(let dep of item.DepartmentnewArray){
        //   let index = Department.findIndex(subDep => subDep == dep.department)
        //   if(index > -1){
        //     DepartmentCount[index] += dep.count;
        //   }else{
        //     Department.push(dep.department)
        //     DepartmentCount.push(dep.count)
        //   }
        // }
      }
      // this.departmentGraph = JSON.stringify({label:Department,percentage:DepartmentCount,colors:this.colors})
      this.graphData = JSON.stringify({ label: ['Male', 'Female'], percentage: [this.graphMale, this.graphFemale], colors: ['#3F51B5', '#576DE6'] })
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  async goToUpdate(event, element) {

    console.log(event.checked, element)
    if (event.checked) {
      this.router.navigate(['/challange-view'], { state: { data: JSON.stringify(element) } })
    } else {
      let formData = {
        "challenges_id": element.challenges_id,
        "action_Required": 0,
        "ip_Address": "127.0.0.1"
      }
      this.ngxService.start();
      await (this._api.deactiveChallenege(formData).subscribe(res => {
        this.ngxService.stop();
        this.getChallangesList()
      }, err => {
        const error = err.error;
        this.ngxService.stop();
      }));
    }
  }

  // open add Employee modal
  openDetailModal(e) {
    if (e.actin_Required == 1) {
      const dialogRef = this.dialog.open(ChallangeDetailComponent, {
        width: '50%',
        data: {
          detail: JSON.stringify(e)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }


  //Searching
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}