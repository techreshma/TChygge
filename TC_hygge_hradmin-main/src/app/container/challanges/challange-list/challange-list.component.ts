import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChallangeDetailComponent } from '../challange-detail/challange-detail.component';
import * as moment from 'moment';
import { TableComponent } from 'src/app/component/table/table.component';

@Component({
  selector: 'app-challange-list',
  templateUrl: './challange-list.component.html',
  styleUrls: ['./challange-list.component.scss']
})

export class ChallangeListComponent implements OnInit {
  // set header column
  displayedColumns: any[] = ['image', 'challenege_Name', 'point', 'acceptedByTotalUserAll', 'expiry', 'switch'];
  displayedColumnsTitle: any[] = ['', 'Challenege Name', 'Point', 'Accepted By', 'Expiry', 'Action'];
  @ViewChild(TableComponent) table: TableComponent;
  graphData: any;
  departmentGraph: any;
  heatGraph: any;
  responseData: any = [];
  accessPermission: boolean;
  departmentData: any = [];
  activeChallanges: number = 0;
  totalParticipant: number = 0;
  graphDetail: any;
  graphMale: number = 0;
  graphFemale: number = 0;
  data: any;
  colors = ['#3F51B5', '#5363BC', '#6876C4', '#7C88CB', '#5363BC', '#6876C4', '#7C88CB', '#BAC0E1', '#CED2E8', '#5363BC', '#7C88CB', '#A5ADDA', '#BAC0E1', '#CED2E8', '#E3E5F0', '#F7F7F7', '#3F51B5', '#5363BC', '#6876C4', '#7C88CB', '#5363BC', '#6876C4', '#7C88CB', '#BAC0E1', '#CED2E8', '#5363BC', '#7C88CB', '#A5ADDA', '#BAC0E1', '#CED2E8', '#E3E5F0', '#F7F7F7']
  isChallenge: boolean = true;
  constructor(public router: Router, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getChallangesList();
    this.getChallangesGraphData();
    
  }


  // challanges list
  async getChallangesList() {
    this.ngxService.start();
    await (this._api.getchallanges().subscribe(res => {
      this.ngxService.stop();
      const response = res;
      this.responseData = response.data;
      let count = 0
      let gData = [{
        name: "",
        data: []
      }]
      for (let item of this.responseData) {
        if (item.expiry != '-') {
          item.expiry = moment(item.expiry).format('DD/MM/YYYY')
        }
        if (item.acceptedByTotalUser) {
          item.acceptedByTotalUserAll = `${item.acceptedByAcceptUser}/${item.acceptedByTotalUser}`
        } else {
          item.acceptedByTotalUserAll = '-'
        }
        if (item.actin_Required == 1) {
          this.activeChallanges++;
          this.totalParticipant += Number(item.acceptedByAcceptUser)
        }
        // if(count > 8){
        gData[0].data.push({ x: item.challenege_Name, y: item.acceptedByAcceptUser ? item.acceptedByAcceptUser : 0 })
        // }else{
        //   gData[1].data.push({x:item.challenege_Name,y:item.acceptedByAcceptUser?item.acceptedByAcceptUser:0})
        // }
        count++;
      }
      if ((gData[0].data.filter(item => item.y > 0)).length > 0) {
        this.heatGraph = JSON.stringify({ data: gData, color: '#3F51B5' })
      }
      this.data = response.data;
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
        for (let dep of item.DepartmentnewArray) {
          let index = Department.findIndex(subDep => subDep == dep.department)
          if (index > -1) {
            DepartmentCount[index] += dep.count;
          } else {
            Department.push(dep.department)
            DepartmentCount.push(dep.count)
          }
        }
      }

      this.departmentGraph = JSON.stringify({ label: Department, percentage: DepartmentCount, colors: this.colors })
      this.graphData = JSON.stringify({ label: ['Male', 'Female'], percentage: [this.graphMale, this.graphFemale], colors: ['#3F51B5', '#576DE6'] })
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));
  }

  async goToUpdate(event, element) {
    console.log(event)
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
  openDetailModal(event, e) {
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
    this.table.filter(filterValue)
  }
}







